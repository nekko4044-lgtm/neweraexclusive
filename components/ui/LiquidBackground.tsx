'use client'

import React, { useEffect, useRef } from 'react'

const VS = `#version 300 es
precision highp float;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

const FS = `#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_imageAspect;
in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);

float fbm(vec2 p) {
  float f = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    f += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return f;
}

void main() {
  // object-cover: scale UV to preserve image aspect ratio
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 uv = vUv;
  if (canvasAspect > u_imageAspect) {
    float scale = u_imageAspect / canvasAspect;
    uv.y = uv.y * scale + (1.0 - scale) * 0.5;
  } else {
    float scale = canvasAspect / u_imageAspect;
    uv.x = uv.x * scale + (1.0 - scale) * 0.5;
  }

  float t1 = u_time * 0.12;
  float n1 = fbm(uv * 3.0 + t1);
  float n2 = fbm(uv * 3.0 + vec2(n1) + t1 * 0.8);
  vec2 distort = vec2(fbm(uv * 2.5 + n2 + t1), fbm(uv * 2.5 - n2 + t1));
  vec2 distortedUv = uv + distort * 0.015;

  vec4 color = texture(u_texture, distortedUv);

  float t2 = u_time * 0.07;
  float spec = fbm(uv * 5.0 + vec2(t2, -t2));
  spec = fbm(vec2(spec) * 4.0 + t2);
  color.rgb += spec * 0.055;

  fragColor = color;
}`

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

class Renderer {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private program: WebGLProgram | null = null
  private texture: WebGLTexture | null = null
  private buffer: WebGLBuffer | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const gl = canvas.getContext('webgl2')
    if (!gl) throw new Error('WebGL2 not supported')
    this.gl = gl

    const prog = gl.createProgram()!
    const vs = compileShader(gl, gl.VERTEX_SHADER, VS)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS)
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    this.program = prog

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    this.buffer = buf

    const posLoc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    ;(prog as any)._uTime = gl.getUniformLocation(prog, 'u_time')
    ;(prog as any)._uRes = gl.getUniformLocation(prog, 'u_resolution')
    ;(prog as any)._uTex = gl.getUniformLocation(prog, 'u_texture')
    ;(prog as any)._uImgAspect = gl.getUniformLocation(prog, 'u_imageAspect')
  }

  loadTexture(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const gl = this.gl
      const tex = gl.createTexture()!
      this.texture = tex
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        if (!this.program) return resolve()
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.useProgram(this.program)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.uniform1i((this.program as any)._uTex, 0)
        gl.uniform1f((this.program as any)._uImgAspect, img.naturalWidth / img.naturalHeight)
        resolve()
      }
      img.onerror = reject
      img.src = url
    })
  }

  updateScale() {
    const gl = this.gl
    const dpr = Math.max(1, window.devicePixelRatio)
    const w = this.canvas.parentElement?.clientWidth ?? window.innerWidth
    const h = this.canvas.parentElement?.clientHeight ?? window.innerHeight
    this.canvas.width = w * dpr
    this.canvas.height = h * dpr
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  render(now: number) {
    const gl = this.gl
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.program)
    gl.uniform1f((this.program as any)._uTime, now * 0.001)
    gl.uniform2f((this.program as any)._uRes, this.canvas.width, this.canvas.height)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  reset() {
    const gl = this.gl
    if (this.program) {
      const shaders = gl.getAttachedShaders(this.program) ?? []
      shaders.forEach(s => { gl.detachShader(this.program!, s); gl.deleteShader(s) })
      gl.deleteProgram(this.program)
      this.program = null
    }
    if (this.texture) { gl.deleteTexture(this.texture); this.texture = null }
    if (this.buffer) { gl.deleteBuffer(this.buffer); this.buffer = null }
  }
}

interface LiquidBackgroundProps {
  imageUrl: string
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let rafId: number
    let alive = true

    const renderer = new Renderer(canvas)
    rendererRef.current = renderer

    renderer.updateScale()
    renderer.loadTexture(imageUrl).then(() => {
      if (!alive) return
      const loop = (now: number) => {
        renderer.render(now)
        rafId = requestAnimationFrame(loop)
      }
      rafId = requestAnimationFrame(loop)
    })

    const observer = new ResizeObserver(() => {
      renderer.updateScale()
    })
    if (canvas.parentElement) observer.observe(canvas.parentElement)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      observer.disconnect()
      renderer.reset()
      rendererRef.current = null
    }
  }, [imageUrl])

  return <canvas ref={canvasRef} className="w-full h-full block" />
}

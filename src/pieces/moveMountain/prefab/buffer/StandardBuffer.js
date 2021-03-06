import { Framebuffer, Texture2D } from '@luma.gl/webgl'
import GL from '@luma.gl/constants'

export default function(gl) {
  return new Framebuffer(gl, {
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight,
    attachments: {
      [GL.COLOR_ATTACHMENT0]: new Texture2D(gl, {
        format: GL.RGBA,
        type: GL.UNSIGNED_BYTE,
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        mipmaps: false,
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
          [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      }),
      [GL.COLOR_ATTACHMENT1]: new Texture2D(gl, {
        format: GL.RGBA,
        type: GL.UNSIGNED_BYTE,
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        mipmaps: false,
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
          [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      }),
      [GL.COLOR_ATTACHMENT2]: new Texture2D(gl, {
        format: GL.RGBA,
        type: GL.UNSIGNED_BYTE,
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        mipmaps: false,
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
          [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      }),
      [GL.DEPTH_ATTACHMENT]: new Texture2D(gl, {
        format: GL.DEPTH_COMPONENT16,
        type: GL.UNSIGNED_SHORT,
        dataFormat: GL.DEPTH_COMPONENT,
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        mipmaps: false,
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
          [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      })
    }
  })
}

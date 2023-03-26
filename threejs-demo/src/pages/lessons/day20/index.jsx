import React, { useEffect, useRef } from 'react'

export default function WebGLCom() { 
    const canvasRef = useRef(null);

    // 初始化
    const init = () => { 

        //获取canvas 宽高
        const WIDTH = Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .width.split('px')[0]
        );
        const HEIGHT = Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .height.split('px')[0]
        );

        //1️⃣ 获取webgl绘图上下文
        const gl = canvasRef.current.getContext('webgl');
        console.log(gl);
        //2️⃣ 设置canvas试图宽高和位置
        gl.viewport(0, 0, WIDTH, HEIGHT);

        //3️⃣ 创建顶点着色器
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        //4️⃣ 编写顶点着色器代码，需要编写GLSL代码
        gl.shaderSource(vertexShader,
            `
            attribute vec4 v_position;
            void main() {
                gl_Position = v_position; // 设置顶点位置
            }
           `)
        //5️⃣ 编译顶点着色器
        gl.compileShader(vertexShader);

        //6️⃣ 创建片元着色器
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) 
        //7️⃣ 编写片元着色器代码 ，需要编写GLSL代码
        gl.shaderSource(fragmentShader, `
        void main() {
            gl_FragColor = vec4(1.0,0.0,0.0,1.0); // 设置片元颜色
        }
        `) 
        //8️⃣ 编译片元着色器
        gl.compileShader(fragmentShader) // 编译着色器代码


        //9️⃣ 创建程序连接器，将顶点着色器和片元着色器链接
        const program = gl.createProgram();
        //🔟 链接 <顶点着色器><片元着色器>
        gl.attachShader(program, vertexShader); // 添加顶点着色器
        gl.attachShader(program, fragmentShader); // 添加片元着色器
        //1️⃣1️⃣ gl连接程序
        gl.linkProgram(program);
        //1️⃣2️⃣ 告诉 WebGL 用这个 program 进行渲染
        gl.useProgram(program);

        //1️⃣3️⃣ 创建顶点缓冲区对象
        const vertexBuffer = gl.createBuffer();
        //1️⃣4️⃣ 绑定顶点缓冲区域
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 
        //1️⃣5️⃣ 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER,后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0.5,
            0.5, 0,
            -0.5, -0.5
        ]), // 三角形的三个顶点，因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
        gl.STATIC_DRAW // 表示缓冲区的内容不会经常更改
        )
    
        //1️⃣6️⃣ 获取顶点着色器中的v_position
        const v_position = gl.getAttribLocation(program, 'v_position');
        //1️⃣7️⃣ 将顶点缓冲区对象分配给v_position
        gl.vertexAttribPointer(v_position, 2, gl.Float, false, 0, 0);
        //1️⃣8️⃣ 启用顶点着色器中的v_position变量
        gl.enableVertexAttribArray(v_position);

        //1️⃣9️⃣ 绘制三角形
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    
    useEffect(() => {
        init();

    },[])

    return (<>
    用原生WebGL生成图形
        <canvas ref={ canvasRef}></canvas>
    </>)
}
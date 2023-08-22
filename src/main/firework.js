import * as Three from "three";
import startPointFragment from "../shaders/startpoint/fragment.glsl";
import startPointVertex from "../shaders/startpoint/vertex.glsl";
import fireworksFragment from "../shaders/fireworks/fragment.glsl";
import fireworksVertex from "../shaders/fireworks/vertex.glsl";

export default class Fireworks {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    // console.log("创建烟花：", color, to);
    this.color = new Three.Color(color);

    // 创建烟花发射的球点
    this.startGeometry = new Three.BufferGeometry();
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute(
      "position",
      new Three.BufferAttribute(startPositionArray, 3)
    );

    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.x;
    this.startGeometry.setAttribute(
      "aStep",
      new Three.BufferAttribute(astepArray, 3)
    );

    // 设置着色器材质
    this.startMaterial = new Three.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: Three.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
        uColor: { value: this.color },
      },
    });

    // console.log(this.startGeometry);
    // 创建烟花点球
    this.startPoint = new Three.Points(this.startGeometry, this.startMaterial);

    // 开始计时
    this.clock = new Three.Clock();

    // 创建爆炸的烟花
    this.fireworkGeometry = new Three.BufferGeometry();
    this.FireworksCount = 180 + Math.floor(Math.random() * 180);
    const positionFireworksArray = new Float32Array(this.FireworksCount * 3);
    const scaleFireArray = new Float32Array(this.FireworksCount);
    const directionArray = new Float32Array(this.FireworksCount * 3);
    for (let i = 0; i < this.FireworksCount; i++) {
      // 一开始烟花位置
      positionFireworksArray[i * 3 + 0] = to.x;
      positionFireworksArray[i * 3 + 1] = to.y;
      positionFireworksArray[i * 3 + 2] = to.z;
      //   设置烟花所有粒子初始化大小
      scaleFireArray[i] = Math.random();
      //   设置四周发射的角度

      let theta = Math.random() * 2 * Math.PI;
      let beta = Math.random() * 2 * Math.PI;
      let r = Math.random();

      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);

      //   console.log(
      //     directionArray[i * 3 + 0],
      //     directionArray[i * 3 + 1],
      //     directionArray[i * 3 + 2]
      //   );
    }
    this.fireworkGeometry.setAttribute(
      "position",
      new Three.BufferAttribute(positionFireworksArray, 3)
    );
    this.fireworkGeometry.setAttribute(
      "aScale",
      new Three.BufferAttribute(scaleFireArray, 1)
    );
    this.fireworkGeometry.setAttribute(
      "aRandom",
      new Three.BufferAttribute(directionArray, 3)
    );

    this.fireworksMaterial = new Three.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
        uColor: { value: this.color },
      },
      transparent: true,
      blending: Three.AdditiveBlending,
      depthWrite: false,
      vertexShader: fireworksVertex,
      fragmentShader: fireworksFragment,
    });

    this.fireworks = new Three.Points(
      this.fireworkGeometry,
      this.fireworksMaterial
    );

    // 创建音频
    this.linstener = new Three.AudioListener();
    this.linstener1 = new Three.AudioListener();
    this.sound = new Three.Audio(this.linstener);
    this.sendSound = new Three.Audio(this.linstener1);

    // 创建音频加载器
    const audioLoader = new Three.AudioLoader();
    audioLoader.load(
      `./assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(1);
      }
    );

    audioLoader.load(`./assets/audio/send.mp3`, (buffer) => {
      this.sendSound.setBuffer(buffer);
      this.sendSound.setLoop(false);
      this.sendSound.setVolume(1);
    });
  }
  //   添加到场景
  addScene(scene, camera) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.scene = scene;
  }
  //   update变量
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    // console.log(elapsedTime);
    if (elapsedTime > 0.2 && elapsedTime < 1) {
      if (!this.sendSound.isPlaying && !this.sendSoundplay) {
        this.sendSound.play();
        this.sendSoundplay = true;
      }
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
    } else if (elapsedTime > 0.2) {
      const time = elapsedTime - 1;
      //   让点元素消失
      this.startMaterial.uniforms.uSize.value = 0;
      this.startPoint.clear();
      this.startGeometry.dispose();
      this.startMaterial.dispose();
      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }
      //设置烟花显示
      this.fireworksMaterial.uniforms.uSize.value = 20;
      //   console.log(time);
      this.fireworksMaterial.uniforms.uTime.value = time;

      if (time > 5) {
        this.fireworksMaterial.uniforms.uSize.value = 0;
        this.fireworks.clear();
        this.fireworkGeometry.dispose();
        this.fireworksMaterial.dispose();
        this.scene.remove(this.fireworks);
        this.scene.remove(this.startPoint);
        return "remove";
      }
    }
  }
}

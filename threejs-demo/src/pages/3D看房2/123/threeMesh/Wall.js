import * as THREE from "three";

export default class Wall extends THREE.Mesh {
  constructor(wallPoints, faceRelation) {
    super();
    this.wallPoints = wallPoints;
    this.faceRelation = faceRelation;
    this.init();
  }
  init() {
    let wallPoints = this.wallPoints;
    wallPoints.forEach((item) => {
      item.x = item.x / 100;
      item.y = item.y / 100;
      item.z = item.z / 100;
    });

    let faceIndexs = [
      // 底面
      [0, 1, 2, 3],
      //   上面
      [4, 5, 6, 7],
      //   左面
      [0, 3, 6, 5],
      //   右面
      [2, 1, 4, 7],
      //   前面
      [1, 0, 5, 4],
      //   后面
      [3, 2, 7, 6],
    ];
    // 材质索引
    let mIndex = [];
    faceIndexs.forEach((item) => {
      //   根据面相关判断对应的全景图和材质
      let faceItem;
      let isFace = this.faceRelation.some((face) => {
        faceItem = face;
        return (
          item.includes(face.index[0]) &&
          item.includes(face.index[1]) &&
          item.includes(face.index[2]) &&
          item.includes(face.index[3])
        );
      });
      if (isFace) {
        mIndex.push(faceItem.panorama);
      } else {
        mIndex.push(0);
      }
    });

    // let faces = [
    //   // 底面
    //   [
    //     [wallPoints[0].x, wallPoints[0].z, wallPoints[0].y],
    //     [wallPoints[1].x, wallPoints[1].z, wallPoints[1].y],
    //     [wallPoints[2].x, wallPoints[2].z, wallPoints[2].y],
    //     [wallPoints[3].x, wallPoints[3].z, wallPoints[3].y],
    //   ],
    //   //   上面
    //   [
    //     [wallPoints[4].x, wallPoints[4].z, wallPoints[4].y],
    //     [wallPoints[5].x, wallPoints[5].z, wallPoints[5].y],
    //     [wallPoints[6].x, wallPoints[6].z, wallPoints[6].y],
    //     [wallPoints[7].x, wallPoints[7].z, wallPoints[7].y],
    //   ],
    // ];

    let faces = faceIndexs.map((item, index) => {
      return [
        [wallPoints[item[0]].x, wallPoints[item[0]].z, wallPoints[item[0]].y],
        [wallPoints[item[1]].x, wallPoints[item[1]].z, wallPoints[item[1]].y],
        [wallPoints[item[2]].x, wallPoints[item[2]].z, wallPoints[item[2]].y],
        [wallPoints[item[3]].x, wallPoints[item[3]].z, wallPoints[item[3]].y],
      ];
    });

    let positions = [];
    let uvs = [];
    let indices = [];
    let nomarls = [];
    let faceNormals = [
      [0, -1, 0],
      [0, 1, 0],
      [-1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];
    let materialGroups = [];

    for (let i = 0; i < faces.length; i++) {
      let point = faces[i];
      let facePositions = [];
      let faceUvs = [];
      let faceIndices = [];

      facePositions.push(...point[0], ...point[1], ...point[2], ...point[3]);
      faceUvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      faceIndices.push(
        0 + i * 4,
        2 + i * 4,
        1 + i * 4,
        0 + i * 4,
        3 + i * 4,
        2 + i * 4
      );

      positions.push(...facePositions);
      uvs.push(...faceUvs);
      indices.push(...faceIndices);
      nomarls.push(
        ...faceNormals[i],
        ...faceNormals[i],
        ...faceNormals[i],
        ...faceNormals[i]
      );

      // 设置材质组
      materialGroups.push({
        start: i * 6,
        count: 6,
        materialIndex: i,
      });
    }

    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(nomarls, 3)
    );
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
    geometry.groups = materialGroups;

    this.geometry = geometry;
    this.material = mIndex.map((item) => {
      if (item == 0) {
        return new THREE.MeshBasicMaterial({ color: 0x333333 });
      } else {
        return item.material;
      }
    });
  }
}

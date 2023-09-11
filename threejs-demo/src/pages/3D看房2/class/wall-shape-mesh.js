import * as THREE from 'three';
import * as _ from 'lodash';

export default class WallShapeMesh extends THREE.Mesh {
    constructor(wallPoints, faceRelation, findPanorama) {
        super();
        this.wallPointsList = wallPoints;
        this.faceRelationList = faceRelation;
        this.findPanorama = findPanorama;

        // 创建模型
        this.generateMesh();
    }

    generateMesh() {
        this.wallPointsList.forEach((item) => {
            item.x = item.x / 100;
            item.y = item.y / 100;
            item.z = item.z / 100;
        });

        // 创建<面>索引值
        // [ { x: 205.65528869628906, y: 94.92129516601562, z: 0, }, { x: 215.65528869628906, y: 94.92129516601562, z: 0, }, { x: 215.65528869628906, y: -63.739532470703125, z: 0, }, { x: 205.65528869628906, y: -63.739532470703125, z: 0, }, { x: 215.65528869628906, y: 94.92129516601562, z: 280, }, { x: 205.65528869628906, y: 94.92129516601562, z: 280, }, { x: 205.65528869628906, y: -63.739532470703125, z: 280, }, { x: 215.65528869628906, y: -63.739532470703125, z: 280, }, ];
        const faceIndices = [
            // 底面
            [0, 1, 2, 3],
            // 上面
            [4, 5, 6, 7],
            // 左面
            [0, 3, 6, 5],
            // 右面
            [2, 1, 4, 7],
            // 前面
            [3, 2, 7, 6],
            // 后面
            [1, 0, 5, 4],
        ];

        const materialIndices = [];
        // 创建材质索引，根据 this.faceRelationList 进行uv映射
        faceIndices.forEach((faceRelationItem) => {
            // 判断材质索引是否在faceIndices中
            // this.faceRelationList.forEach((item) => {
            //     // lodash 进行深度比较两个数组
            //     if (_.isEqual(faceRelationItem.index, item)) {
            //         // 如果相同就忘材质索引数组中添加材质url
            //         materialIndices.push(this.findPanorama);
            //     } else {
            //         materialIndices.push(0);
            //     }
            // });
            // console.log(materialIndices);

            let isFace = this.faceRelationList.some((face) => {
                return (
                    faceRelationItem.includes(face.index[0]) &&
                    faceRelationItem.includes(face.index[1]) &&
                    faceRelationItem.includes(face.index[2]) &&
                    faceRelationItem.includes(face.index[3])
                );
            });
            if (isFace) {
                materialIndices.push(this.findPanorama);
            } else {
                materialIndices.push(0);
            }
        });

        // const faces = [
        // [
        //     [
        //         this.wallPointsList[0].x,
        //         this.wallPointsList[0].y,
        //         this.wallPointsList[0].z,
        //     ],
        //     [
        //         this.wallPointsList[1].x,
        //         this.wallPointsList[1].y,
        //         this.wallPointsList[1].z,
        //     ],
        //     [
        //         this.wallPointsList[2].x,
        //         this.wallPointsList[2].y,
        //         this.wallPointsList[2].z,
        //     ],
        //     [
        //         this.wallPointsList[3].x,
        //         this.wallPointsList[3].y,
        //         this.wallPointsList[3].z,
        //     ],
        // ],
        // [
        //     [
        //         this.wallPointsList[4].x,
        //         this.wallPointsList[4].y,
        //         this.wallPointsList[4].z,
        //     ],
        //     [
        //         this.wallPointsList[5].x,
        //         this.wallPointsList[5].y,
        //         this.wallPointsList[5].z,
        //     ],
        //     [
        //         this.wallPointsList[6].x,
        //         this.wallPointsList[6].y,
        //         this.wallPointsList[6].z,
        //     ],
        //     [
        //         this.wallPointsList[7].x,
        //         this.wallPointsList[7].y,
        //         this.wallPointsList[7].z,
        //     ],
        //  ]
        // ];

        let faces = faceIndices.map((item, index) => {
            return [
                [
                    this.wallPointsList[item[0]].x,
                    this.wallPointsList[item[0]].z,
                    this.wallPointsList[item[0]].y,
                ],
                [
                    this.wallPointsList[item[1]].x,
                    this.wallPointsList[item[1]].z,
                    this.wallPointsList[item[1]].y,
                ],
                [
                    this.wallPointsList[item[2]].x,
                    this.wallPointsList[item[2]].z,
                    this.wallPointsList[item[2]].y,
                ],
                [
                    this.wallPointsList[item[3]].x,
                    this.wallPointsList[item[3]].z,
                    this.wallPointsList[item[3]].y,
                ],
            ];
        });

        let positions = [];
        let uvs = [];
        let indices = [];
        let nomarls = [];

        // 材质组
        let materialGroups = [];
        // 创建position
        let position = [];
        // 设置法向
        let normals = [];
        // 设置法向线索引
        const faceNormals = [
            [0, -1, 0], // 法向线向下
            [0, 1, 0], // 法向线向上
            [-1, 0, 0], // 法向线向左
            [1, 0, 0],
            [0, 0, 1], // 法向线向前
            [0, 0, -1],
        ];

        for (let i = 0; i < faces.length; i++) {
            let point = faces[i];
            let facePositions = [];
            let faceUvs = [];
            let faceIndices = [];

            facePositions.push(
                ...point[0],
                ...point[1],
                ...point[2],
                ...point[3]
            );
            faceUvs.push(0, 0, 0, 1, 1, 1, 1, 0);
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

        // 创建自定义几何体
        const buffgeometry = new THREE.BufferGeometry();
        buffgeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        buffgeometry.setAttribute(
            'uv',
            new THREE.Float32BufferAttribute(uvs, 2)
        );
        buffgeometry.setAttribute(
            'normal',
            new THREE.Float32BufferAttribute(nomarls, 3)
        );
        buffgeometry.setIndex(
            new THREE.BufferAttribute(new Uint16Array(indices), 1)
        );
        buffgeometry.groups = materialGroups;
        this.geometry = buffgeometry;
        this.material = materialIndices.map((item) => {
            if (!item) {
                return new THREE.MeshBasicMaterial({ color: 0x333333 });
            } else {
                return item.material;
            }
        });
    }
}

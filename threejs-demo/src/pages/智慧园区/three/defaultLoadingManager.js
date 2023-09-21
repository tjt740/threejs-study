import * as THREE from 'three';

const defaultLoadingManager = (THREE.DefaultLoadingManager.onProgress = (
    item,
    loaded,
    total
) => {
    console.log('进度:', Number((loaded / total) * 100).toFixed(2) + '%');
});

export default defaultLoadingManager;

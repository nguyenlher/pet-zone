export interface Pet3DModelItem {
  id: string;
  name: string;
  breed: string;
  type: 'DOG' | 'CAT';
  modelUrl: string;
  scale?: number;
}

export const PET_3D_MODELS: Pet3DModelItem[] = [
  {
    id: 'shiba-inu',
    name: 'Hachi',
    breed: 'Shiba Inu',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159256/super-petmark-3d/models/shiba-inu_dqqv4g.glb',
  },
  {
    id: 'corgi',
    name: 'Rocky',
    breed: 'Corgi',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159266/super-petmark-3d/models/corgi_qwrdc2.glb',
  },
  {
    id: 'golden-retriever',
    name: 'Max',
    breed: 'Golden Retriever',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159199/super-petmark-3d/models/golden-retriever_lxpgzf.glb',
  },
  {
    id: 'samoyed',
    name: 'Snow',
    breed: 'Samoyed',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159274/super-petmark-3d/models/Samoyed_lrr4ia.glb',
  },
  {
    id: 'chihuahua',
    name: 'Tiny',
    breed: 'Chihuahua',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159260/super-petmark-3d/models/chihuahua_phf6gb.glb',
  },
  {
    id: 'dachshund',
    name: 'Oscar',
    breed: 'Dachshund',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159254/super-petmark-3d/models/dachshund_udwoo6.glb',
  },
  {
    id: 'husky',
    name: 'Luna',
    breed: 'Husky Siberian',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159204/super-petmark-3d/models/Husky-Siberian_jxsfwe.glb',
  },
  {
    id: 'labrador',
    name: 'Buddy',
    breed: 'Labrador Retriever',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159196/super-petmark-3d/models/Labrador-Retriever_jd6tp6.glb',
  },
  {
    id: 'pomeranian',
    name: 'Fluffy',
    breed: 'Pomeranian',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159262/super-petmark-3d/models/Pomeranian_zkuyuh.glb',
  },
  {
    id: 'poodle',
    name: 'Charlie',
    breed: 'Poodle Toy',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159274/super-petmark-3d/models/poodle-toy_bho9ef.glb',
  },
  {
    id: 'pug',
    name: 'Puggy',
    breed: 'Pug',
    type: 'DOG',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159253/super-petmark-3d/models/pug-dog_zocm3k.glb',
  },
  {
    id: 'british-shorthair',
    name: 'Simba',
    breed: 'Anh Lông Ngắn',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159247/super-petmark-3d/models/British-Shorthair_iavz1a.glb',
  },
  {
    id: 'munchkin',
    name: 'Mochi',
    breed: 'Munchkin',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159221/super-petmark-3d/models/Munchkin_rozzad.glb',
  },
  {
    id: 'ragdoll',
    name: 'Angel',
    breed: 'Ragdoll',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159220/super-petmark-3d/models/Ragdoll_pyvm5i.glb',
  },
  {
    id: 'siamese',
    name: 'Nala',
    breed: 'Mèo Xiêm',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159226/super-petmark-3d/models/siamese_lxgcpz.glb',
  },
  {
    id: 'bengal',
    name: 'Tiger',
    breed: 'Mèo Bengal',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159203/super-petmark-3d/models/Bengal_zdcpjp.glb',
  },
  {
    id: 'maine-coon',
    name: 'Leo',
    breed: 'Maine Coon',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159229/super-petmark-3d/models/maine-coon_eum3p4.glb',
  },
  {
    id: 'russian-blue',
    name: 'Blue',
    breed: 'Russian Blue',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159228/super-petmark-3d/models/russian-blue_vtat8m.glb',
  },
  {
    id: 'scottish-fold',
    name: 'Foldy',
    breed: 'Scottish Fold',
    type: 'CAT',
    modelUrl: 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159212/super-petmark-3d/models/Scottish-Fold_n6vy3q.glb',
  },
];

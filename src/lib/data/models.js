import { tfkModels } from '$lib/data/tfk-models' // Telemarks modeller
import { vfkModels } from '$lib/data/vfk-models' // Vestfolds modeller

export const models = import.meta.env.VITE_COUNTY === 'Vestfold' ? vfkModels : tfkModels

const adapters = {};

export default async ({ config }) => {
  try{
    const { adapters: adaptersList } = config;
    for (const key in adaptersList) {
        const adapter = adaptersList[key];

        if (adapter) {
            adapters[key] = adapter;
        }
    }
  }catch(error){
    throw error;
  }
}

export const getAdapter = (key) => {
  return adapters[key];
}
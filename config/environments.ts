export interface Environment {
  name: string;
  dataDriver: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  slowMo?: number;
}

/**
 * Define test environments and attributes
 */
export const environments: Record<string, Environment> = {
  qa1: {
    name: 'q1',
    dataDriver: 'DataDriverVovQA.xlsx',
    baseUrl: 'https://qa1.viaone.com/',
    timeout: 30000,
    retries: 1,
    headless: true,
    slowMo: 0
  },
  qa2: {
    name: 'QA2',
    dataDriver: 'DataDriverVovQA.xlsx',
    baseUrl: 'https://qa2.viaone.com/',
    timeout: 30000,
    retries: 1,
    headless: true,
    slowMo: 0
  },
  preprod: {
    name: 'PREPROD',
    dataDriver: 'DataDriverVovPreProd.xlsx',
    baseUrl: 'https://preprod.viaone.com/',
    timeout: 30000,
    retries: 1,
    headless: true,
    slowMo: 0
  },
  demo: {
    name: 'DEMO',
    dataDriver: 'DataDriverVovDemo.xlsx',
    baseUrl: 'https://demo.viaone.com/',
    timeout: 30000,
    retries: 1,
    headless: false,
    slowMo: 100
  },
  proto: {
    name: 'PROTO',
    dataDriver: 'DataDriverVovProto.xlsx',
    baseUrl: 'https://proto.viaone.com/',
    timeout: 30000,
    retries: 1,
    headless: false,
    slowMo: 100
  }
};

export function getEnvironment(env: string = 'qa'): Environment {
  const environment = environments[env.toLowerCase()];
  if (!environment) {
    throw new Error(`Environment '${env}' not found. Available environments: ${Object.keys(environments).join(', ')}`);
  }
  return environment;
}
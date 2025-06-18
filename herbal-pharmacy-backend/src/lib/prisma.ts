// Mock Prisma client for development
export const prisma = {
  product: {
    findMany: async () => {
      // Return mock products
      return [
        {
          id: '1',
          name: 'Organic Moringa Powder',
          description: 'Premium quality moringa powder packed with essential vitamins and minerals.',
          price: 24.99,
          stock: 100,
          category: 'Herbal Supplements',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Authentic African Black Soap',
          description: 'Handcrafted traditional African black soap made from plantain skins.',
          price: 12.99,
          stock: 150,
          category: 'African Black Soap',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Raw Unrefined Shea Butter',
          description: 'Pure, unrefined shea butter sourced directly from Ghana.',
          price: 18.99,
          stock: 80,
          category: 'Pure Shea Butter',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    },
    create: async (data: any) => {
      return {
        id: Date.now().toString(),
        ...data.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    update: async (data: any) => {
      return {
        id: data.where.id,
        ...data.data,
        updatedAt: new Date().toISOString(),
      };
    },
    delete: async (data: any) => {
      return { id: data.where.id };
    },
    deleteMany: async (data: any) => {
      return { count: data.where.id.in.length };
    },
    updateMany: async (data: any) => {
      return { count: data.where.id.in.length };
    },
    count: async () => 3,
  },
  user: {
    findMany: async () => {
      return [
        {
          id: '1',
          email: 'admin@natureheal.com',
          name: 'Admin User',
          role: 'ADMIN',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'customer@example.com',
          name: 'John Doe',
          role: 'CUSTOMER',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    },
    count: async () => 2,
  },
  order: {
    findMany: async () => {
      return [
        {
          id: '1',
          userId: '2',
          user: {
            name: 'John Doe',
            email: 'customer@example.com',
          },
          total: 45.98,
          status: 'DELIVERED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: '2',
          user: {
            name: 'John Doe',
            email: 'customer@example.com',
          },
          total: 32.99,
          status: 'PROCESSING',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    },
    count: async () => 2,
    groupBy: async () => {
      return [
        {
          createdAt: new Date().toISOString(),
          _count: { id: 1 },
          _sum: { total: 45.98 },
        },
        {
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          _count: { id: 1 },
          _sum: { total: 32.99 },
        },
      ];
    },
  },
};
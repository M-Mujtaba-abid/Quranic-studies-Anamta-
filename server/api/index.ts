export default async function vercelHandler(req: any, res: any) {
  const { default: handler } = await import('../dist/main.js');
  return handler(req, res);
}

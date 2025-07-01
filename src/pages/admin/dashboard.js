import Link from 'next/link';

const Dashboard = () => {
  return (
    <div>
      <h1>Panel de Administración</h1>
      <ul>
        <li>
          <Link href="/admin/inventory">Gestión de Inventarios</Link>
        </li>
        <li>
          <Link href="/admin/products">Gestión de Productos</Link>
        </li>
        <li>
          <Link href="/orders">Órdenes de Compra</Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;

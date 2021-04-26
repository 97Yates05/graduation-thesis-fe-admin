import { Link } from 'umi';
import 'tailwindcss/tailwind.css';

export default function IndexPage() {
  return (
    <div className="h-full">
      <Link to="/industry-chain">新建</Link>
    </div>
  );
}

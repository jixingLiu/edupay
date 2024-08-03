import { Outlet } from 'umi';

export default function Layout() {
  return (
    <div className={'h-full w-full'}>
      <Outlet />
    </div>
  );
}

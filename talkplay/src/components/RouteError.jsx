import { useRouteError } from 'react-router-dom';
import SafeFallback from './SafeFallback.jsx';

export default function RouteError() {
  const error = useRouteError();

  return <SafeFallback error={error} />;
}

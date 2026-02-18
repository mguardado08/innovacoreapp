import CrudPage from '../components/crud/CrudPage';
import { ResourceConfig } from '../types/resources';

type ResourcePageProps = {
  resource: ResourceConfig;
};

const ResourcePage = ({ resource }: ResourcePageProps) => <CrudPage resource={resource} />;

export default ResourcePage;

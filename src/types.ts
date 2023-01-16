export type CodeFile = {
  id?: string;
  name: string;
  content: string | null;
  project?: string;
  last_modified?: string;
  url?: string;
  icon?: string;
  content_type?: string;
  size?: number;
  extension?: string;
  owner?: string;
};

export type CodeFolder = {
  name: string;
  code_files?: CodeFile[];
  code_folders?: CodeFolder[];
};

export type Project = {
  id?: string;
  name: string;
  description?: string;
  last_modified: string;
  code_files?: CodeFile[];
  issues?: Issue[];
  owner?: string;
};

export type DataStore = {
  image: string;
  protocol: "tcp";
  name?: string;
  host?: string;
  host_port?: number;
  username?: string;
  password?: string;
  database?: string;
  container_id?: string;
  database_uri?: string;
  container_port?: number;
  owner?: string;
};

export type MicroService = {
  id?: string;
  name: string;
  runtime: string;
  functionName?: string;
  code?: CodeFile[];
  zip?: Blob;
  zip_url?: string;
  function_url?: string;
  function_id?: string;
  function_arn?: string;
  owner?: string;
};

export type Issue = {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  labels?: string[];
  completed?: boolean;
  project?: string;
  last_modified?: string;
  owner?: string;
};

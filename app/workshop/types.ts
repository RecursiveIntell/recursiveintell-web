export type MakerProject = {
  id:string; title:string; creator:string; category:string; boards:string[]; boardDetails?:string[];
  difficulty:string; materials:string[]; summary:string; whyPrint:string; parts:string[];
  steps:{title:string;body:string}[]; printNotes:string; firmware:string; sourceUrl:string;
  instructionsUrl:string; supportingUrls?:string[]; modelUrl:string|null; modelSourceUrl?:string;
  modelStatus:string; images:{url:string;credit:string;sourceUrl:string}[]; imageNote?:string;
  imagePath:string; checkedAt:string; evidence:string; safety:string; estimatedBuildTime:string; addedAt?:string;
};
export type MakerCatalog = {projects:MakerProject[];meta:{matched?:number;offset?:number;pageSize?:number;categories?:string[];total:number;limit:number;absoluteLimit?:number;lastChecked?:string;lastUpdated?:string}};

export interface Adventure { id:string; title:string; sdg:number; city:string; country:string }
export interface LearningLocation { id:string; adventure_id:string; title:string; fictional:boolean }
export interface Lesson { id:string; location_id:string; title:string; objectives:string[]; skill_ids:string[] }
export interface Skill { id:string; title:string }
export interface EducationalResource { id:string; lesson_id:string; title:string; url:string; category:string }
export interface Curriculum { adventures:Adventure[]; locations:LearningLocation[]; lessons:Lesson[]; skills:Skill[]; resources:EducationalResource[] }

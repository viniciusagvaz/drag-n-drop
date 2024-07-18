import * as Project from "../models/project.js";

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
export class ProjectState extends State<Project.Project> {
  private projects: Project.Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project.Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      Project.ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice());
    }
  }

  moveProject(projectId: string, newStatus: Project.ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId)!;

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  updateListeners() {
    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();

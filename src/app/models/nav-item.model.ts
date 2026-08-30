import { LinkItem } from "./link-item.model";

export interface NavItem {
  label: string;
  link?: string;
  icon?: string;
  children?:  LinkItem[]
}
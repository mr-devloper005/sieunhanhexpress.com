import type { TaskKey } from '@/lib/site-config'

/*
  Navigation visibility.

  Task keys listed here are hidden from every navigation surface — the navbar,
  the menu panel, the footer, the hero chips and the category grid. The routes
  themselves stay live and fully rendered; only the links are removed, so
  existing URLs, sitemaps and detail pages keep working exactly as before.
*/
export const hiddenNavTaskKeys: TaskKey[] = ['profile']

/** True when a task should appear in navigation. */
export function isNavVisibleTask(key: string) {
  return !hiddenNavTaskKeys.includes(key as TaskKey)
}

/** Filter any list of task configs down to the navigable ones. */
export function navVisibleTasks<T extends { key: string; enabled?: boolean }>(tasks: readonly T[]) {
  return tasks.filter((task) => task.enabled !== false && isNavVisibleTask(task.key))
}

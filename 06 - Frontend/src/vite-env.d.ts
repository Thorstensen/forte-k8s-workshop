/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEAM_GENERATOR_URL: string
  readonly VITE_BETTING_SERVICE_URL: string
  readonly VITE_MATCH_SCHEDULER_URL: string
  readonly VITE_STATS_AGGREGATOR_URL: string
  readonly VITE_NOTIFICATION_CENTER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
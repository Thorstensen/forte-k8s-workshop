{{/*
Expand the name of the chart.
*/}}
{{- define "forte-workshop.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "forte-workshop.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "forte-workshop.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "forte-workshop.labels" -}}
helm.sh/chart: {{ include "forte-workshop.chart" . }}
{{ include "forte-workshop.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "forte-workshop.selectorLabels" -}}
app.kubernetes.io/name: {{ include "forte-workshop.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Generate full image name
*/}}
{{- define "forte-workshop.image" -}}
{{- $registry := .registry | default .Values.image.registry -}}
{{- $repository := .repository -}}
{{- $tag := .tag | default "latest" -}}
{{- if $registry -}}
{{- printf "%s/%s:%s" $registry $repository $tag -}}
{{- else -}}
{{- printf "%s:%s" $repository $tag -}}
{{- end -}}
{{- end }}

{{/*
Generate frontend config URLs from ingress hosts
*/}}
{{- define "forte-workshop.frontendConfig" -}}
{{- $portSuffix := "" -}}
{{- if .Values.ingress.hostPort -}}
{{- $portSuffix = printf ":%s" .Values.ingress.hostPort -}}
{{- end -}}
window.ENV = {
  VITE_TEAM_GENERATOR_URL: 'http://{{ .Values.ingress.hosts.teamGenerator }}{{ $portSuffix }}',
  VITE_BETTING_SERVICE_URL: 'http://{{ .Values.ingress.hosts.bettingService }}{{ $portSuffix }}',
  VITE_MATCH_SCHEDULER_URL: 'http://{{ .Values.ingress.hosts.matchScheduler }}{{ $portSuffix }}',
  VITE_STATS_AGGREGATOR_URL: 'http://{{ .Values.ingress.hosts.statsAggregator }}{{ $portSuffix }}',
  VITE_NOTIFICATION_CENTER_URL: 'http://{{ .Values.ingress.hosts.notificationCenter }}{{ $portSuffix }}',
};
{{- end }}

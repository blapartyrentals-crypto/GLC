{{- define "glc.name" -}}
{{- .Chart.Name }}-{{ .Release.Name }}
{{- end -}}

{{- define "glc.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
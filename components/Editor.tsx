import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import baseURL from '../static/baseURL'
import { EditorDidMount, EditorWillMount } from 'react-monaco-editor'
import styled from 'styled-components'
import { useMeasure } from 'react-use'
import { useEditor } from './Editor/EditorContext'
import { schema } from '../static/invoice'
import theme from './Editor/theme.json'
import packagejson from '../package.json'
import { dequal } from 'dequal/lite'
const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false })
export { ApiLink } from './Editor/ApiLink'
export { Header } from './Header'
export { useEditor }

const Editor = () => {
  const [ref, { width, height }] = useMeasure()
  const { setJson, json } = useEditor()
  const [jsonString, setJsonString] = useState<string>(JSON.stringify(json, null, 2))

  const onWillMount: EditorWillMount = monaco => {
    //@ts-ignore
    monaco.editor.defineTheme('dok-theme', theme)
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [{ schema, uri: baseURL + '/schema.json', fileMatch: ['*'] }],
    })
  }

  useEffect(() => {
    const oldJson = JSON.parse(jsonString)
    if (!dequal(json, oldJson)) setJsonString(JSON.stringify(json, null, 2))
  }, [json])

  const onDidMount: EditorDidMount = (_, monaco) => {
    monaco.editor.setTheme('dok-theme')
    //@ts-ignore
    window.MonacoEnvironment.getWorkerUrl = (_moduleId: string, label: string) => {
      if (label === 'json') return '_next/static/json.worker.js'
    }
  }

  useEffect(() => {
    try {
      const newJson = JSON.parse(jsonString)
      if (!dequal(json, newJson)) setJson(newJson)
    } catch (e) {
      console.error(e)
    }
  }, [jsonString])

  return (
    <Container ref={ref}>
      <MonacoEditor
        editorWillMount={onWillMount}
        editorDidMount={onDidMount}
        onChange={setJsonString}
        value={jsonString}
        language="json"
        theme="vs-dark"
        width={width}
        height={height}
        options={{
          theme: 'dok-theme',
          folding: false,
          padding: { top: 15 },
          scrollBeyondLastLine: false,
          //@ts-ignore
          lineNumbers: false,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            horizontal: 'auto',
          },
        }}
      />
      <Version>
        v{packagejson.version} Beta
        {process.env.NEXT_PUBLIC_ENVIRONMENT && ` [${process.env.NEXT_PUBLIC_ENVIRONMENT}]`}
      </Version>
    </Container>
  )
}

const Version = styled.div`
  position: absolute;
  left: 16px;
  bottom: 16px;
  opacity: 0.1;
  font-size: 19px;
  color: #ffffff;
  pointer-events: none;
`

const Container = styled.div`
  height: 100%;
  min-width: 350px;
  position: relative;
`

export default Editor

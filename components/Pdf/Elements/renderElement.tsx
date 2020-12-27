import { Text } from '@react-pdf/renderer'
import { Node } from '@mikkmartin/figma-js'
import { Rect } from './Rect'
import { Frame } from './Frame'

export const renderElement = (node: Node, i) => {
  switch (node.type) {
    case 'TEXT':
      return <Text key={i}>{node.characters}</Text>
    case 'RECTANGLE':
      return <Rect key={i} node={node} nth={i + 1} />
    case 'FRAME':
      return <Frame key={i} node={node} nth={i + 1} />
    default:
      console.warn(`Node type: ${node.type} not supported!`)
  }
}
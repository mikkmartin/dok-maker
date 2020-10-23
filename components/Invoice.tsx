import { FC } from 'react'
import ReactPDF, { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import initial from '../static/initialInput'
import { template } from '../static/designTemplate'
import { Invoice as InvoiceData } from '../static/initialInput'
//@ts-ignore

type Props = {
  data?: InvoiceData
}

export const Invoice: FC<Props> = ({ data: inputs }) => {
  const data = { ...initial, ...inputs }
  const { width, height } = template.absoluteBoundingBox
  const textNodes = template.children.filter(child => child.type === 'TEXT')

  const getColor = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`
  const getAlignMent = (string: string) => {
    switch (string) {
      case 'RIGHT':
        return 'right'
      default:
        return 'left'
    }
  }
  const getText = (name: string, templateCharacters: string) => {
    let text
    for (const [key, value] of Object.entries(data)) {
      if (name === key) return value
      text = templateCharacters
    }
    return text
  }

  return (
    <Document>
      <Page
        size={{ width, height }}
        style={StyleSheet.create({
          page: {
            backgroundColor: getColor(template.backgroundColor),
          },
        })}>
        <View style={styles.section}>
          {textNodes.map(({ name, characters, absoluteBoundingBox, style, opacity }, i) => (
            <Text
              key={i}
              style={
                StyleSheet.create({
                  absolute: {
                    position: 'absolute',
                    top: absoluteBoundingBox.y,
                    left: absoluteBoundingBox.x,
                    textAlign: getAlignMent(style.textAlignHorizontal),
                    lineHeight: style.lineHeightPx / 10,
                    width: absoluteBoundingBox.width,
                    fontSize: style.fontSize,
                    letterSpacing: style.letterSpacing,
                    opacity: opacity,
                  },
                }).absolute
              }>
              {getText(name, characters)}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

export async function streamDocument({ data }: Props) {
  return ReactPDF.renderToStream(<Invoice data={data} />)
}

import { FC, useRef } from 'react'
import { useClickAway } from 'react-use'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { snappy } from '../../static/transitions'
import { PanelState } from './Header'
import { InfoPanel } from './Drawer/InfoPanel'
import { TemplatePanel } from './Drawer/TemplatePanel'
import { AddTemplate } from './Drawer/AddTemplate'
import { usePrevious } from 'react-use'
import { Tab } from './Drawer/Tab'
import { useLocalStorage } from 'react-use'

type Props = {
  panels: string[]
  panel: PanelState
  setOpenPanel: (state: PanelState) => void
}

export const Drawer: FC<Props> = ({ panels, panel, setOpenPanel }) => {
  const previousPanel = usePrevious(panel) as string
  const ref = useRef()
  const [customTemplates, setCustomTemplates] = useLocalStorage('designTemplates', [])

  useClickAway(ref, (ev: any) => {
    const el = ev.target
    const exptions =
      !!['Button', 'MuiPopover-root'].find(str => el.className.includes(str))
      || el.getAttribute('aria-hidden') === 'true'
    if (!exptions) setOpenPanel(false)
  }, ['click'])

  const handleAddTemplate = ({ template, name }) => {
    const previousTemplates = customTemplates === undefined ? [] : customTemplates
    setCustomTemplates([
      ...previousTemplates,
      { dateAdded: new Date(), template, name }
    ])
    setOpenPanel('templates')
  }

  const currentPanel = (initial) => {
    const props = { panels, panel, initial, previousPanel }
    switch (panel) {
      case 'info':
        return (
          <Tab {...props} key={panel}>
            <InfoPanel close={close} />
          </Tab>
        )
      case 'templates':
        return (
          <Tab {...props} key={panel}>
            <TemplatePanel close={close} onModify={() => setOpenPanel('addtemplate')} />
          </Tab>
        )
      case 'addtemplate':
        return (
          <Tab {...props} key={panel}>
            <AddTemplate onCancel={() => setOpenPanel('templates')} onAdd={handleAddTemplate} />
          </Tab>
        )
    }
  }

  return (
    <AnimatePresence>
      {panel &&
        <Container
          ref={ref}
          initial="closed"
          animate="open"
          exit="closed"
          variants={containerVariants}
          transition={snappy}>
          <div>
            <AnimatePresence custom={panel}>
              {currentPanel(!previousPanel)}
            </AnimatePresence>
          </div>
        </Container>
      }
    </AnimatePresence>
  )
}

const containerVariants = {
  closed: { height: 0, transition: snappy },
  open: {
    height: 'auto',
    transition: snappy
  },
}
const Container = styled(motion.div)`
  position: absolute;
  background: #3e4249;
  top: 56px;
  left: 0;
  z-index: 1;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    position: relative;
    width: 100%;
    height: 256px;
    background: rgba(255, 255, 255, 0.05);
  }
`
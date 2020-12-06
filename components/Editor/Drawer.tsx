import { FC, useRef } from 'react'
import { useClickAway } from 'react-use'
import { AnimatePresence, motion } from 'framer-motion'
import styled, { css } from 'styled-components'
import { snappy } from '../../static/transitions'
import { PanelState } from './Header'
import { InfoPanel } from './InfoPanel'
import { TemplatePanel } from './TemplatePanel'
import { AddTemplate } from './AddTemplate'
import { usePrevious } from 'react-use'

type Props = {
  panels: string[]
  panel: PanelState
  setOpenPanel: (state: PanelState) => void
}

export const Drawer: FC<Props> = ({ panels, panel, setOpenPanel }) => {
  const previousPanel = usePrevious(panel) as string
  const close = () => setOpenPanel(false)
  const ref = useRef()
  useClickAway(ref, close, ['click'])

  const directionVariant = (dir: boolean) => ({
    x: dir ? "100%" : "-100%"
  });

  const tabProps = (initial = false) => ({
    transition: snappy,
    key: panel as string,
    custom: panel,
    exit: 'exit',
    initial: [!initial && 'enter', initial && 'hidden'],
    animate: ['in', 'revealed'],
    variants: {
      enter: (p) => directionVariant(panels.indexOf(p) > panels.indexOf(previousPanel)),
      exit: (p) => directionVariant(panels.indexOf(p) < panels.indexOf(panel as string)),
      in: { x: '0%' },
      revealed: { transition: { staggerChildren: 0.05 } }
    }
  })

  const currentPanel = (initial) => {
    switch (panel) {
      case 'info':
        return (
          <Tab {...tabProps(initial)}>
            <InfoPanel close={close} />
          </Tab>
        )
      case 'templates':
        return (
          <Tab {...tabProps(initial)}>
            <TemplatePanel close={close} onModify={() => setOpenPanel('addtemplate')} />
          </Tab>
        )
      case 'addtemplate':
        return (
          <Tab {...tabProps(initial)}>
            <AddTemplate onCancel={() => setOpenPanel('templates')} />
          </Tab>
        )
    }
  }

  return (
    <AnimatePresence>
      {panel &&
        <Container
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
  closed: { height: 0, transition: { ...snappy, stiffness: 2500 } },
  open: {
    height: 'auto',
    transition: snappy
  },
}

const Tab = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const Content = styled.div`
  padding: 16px 16px 0;
`
export const ButtonStack = styled(motion.div)`
  display: flex;
  width: 100%;
  gap: 1px;
  button {
    flex: 1;
  }
`
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
    min-height: 240px;
    background: rgba(255, 255, 255, 0.05);
  }
`
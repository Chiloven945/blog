export type SettingsSection = 'general' | 'content' | 'features'

export function useSettingsModal() {
    const isOpen = useState('settings-modal-open', () => false)
    const activeSection = useState<SettingsSection>(
        'settings-active-section',
        () => 'general'
    )

    function open(section: SettingsSection = 'general') {
        activeSection.value = section
        isOpen.value = true
    }

    function close() {
        isOpen.value = false
    }

    function setSection(section: SettingsSection) {
        activeSection.value = section
    }

    return {isOpen, activeSection, open, close, setSection}
}

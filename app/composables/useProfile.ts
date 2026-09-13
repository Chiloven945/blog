import type {ProfileData} from '#shared/schemas/profile'

interface ProfileDocument extends ProfileData {
    stem?: string
}

/** The current locale's personal profile (`content/data/profile/<locale>.yml`). */
export function useProfile() {
    const {locale} = useI18n()

    const {data} = useAsyncData(
        () => `profile-${locale.value}`,
        () => queryCollection('profile').all() as unknown as Promise<ProfileDocument[]>,
    )

    const profile = computed<ProfileData | null>(() => {
        const list = data.value ?? []

        return (
            list.find(item => item.stem?.endsWith(`/${locale.value}`)) ??
            list[0] ??
            null
        )
    })

    return {profile}
}

export interface ProfileSettingsType {
    userImageId: string
    username: string
    name?: string
    surname?: string
    status?: 'active' | 'sleep' | 'hidden'
}
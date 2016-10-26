import * as Electron from 'electron';
import * as Fs from 'fs';
import * as Mkdirp from 'mkdirp';

/**
 * Generates a random id that is unique enough for our purposes.
 */
export const uniqueId = () => Math.random().toString(24).slice(2);

const ensureStoragePath = (): string => {
    const app = Electron.app || Electron.remote.app;
    const USER_DATA_PATH = app.getPath('userData');
    const path = `${USER_DATA_PATH}/botframework-emulator`;
    Mkdirp.sync(path);
    return path;
}

/**
 * Load JSON object from file.
 */
export const loadSettings = <T>(filename: string, defaultSettings: T): T => {
    try {
        filename = `${ensureStoragePath()}/${filename}`;
        const stat = Fs.statSync(filename);
        if (stat.isFile()) {
            const loaded = JSON.parse(Fs.readFileSync(filename, 'utf8'));
            const settings = defaultSettings;
            Object.assign(settings, loaded);
            return settings;
        }
        return defaultSettings;
    } catch (e) {
        console.error(`Failed to read file: ${filename}`, e);
        return defaultSettings;
    }
}

/**
 * Save JSON object to file.
 */
export const saveSettings = <T>(filename: string, settings: T) => {
    try {
        filename = `${ensureStoragePath()}/${filename}`;
        Fs.writeFileSync(filename, JSON.stringify(settings, null, 2), 'utf8');
    } catch (e) {
        console.error(`Failed to write file: ${filename}`, e);
    }
}

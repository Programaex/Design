import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** Writes `content` to the cache and opens the system share sheet. */
export async function shareText(name: string, content: string, mimeType: string) {
	const f = new File(Paths.cache, name);
	if (f.exists) f.delete();
	f.create();
	await f.write(content);
	await Sharing.shareAsync(f.uri, { mimeType, dialogTitle: name });
}

/** Lets the user pick a JSON or CSV file and returns its name and text (null when cancelled). */
export async function pickText(): Promise<{ name: string; text: string } | null> {
	const r = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/csv', 'text/comma-separated-values', 'text/plain'], copyToCacheDirectory: true });
	if (r.canceled || !r.assets?.length) return null;
	const asset = r.assets[0];
	return { name: asset.name, text: await new File(asset.uri).text() };
}

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { spacing, themeColors } from '../theme/theme';
import { Button, Input } from '../components/UI';
import { createNote, getNoteById, updateNote } from '../storage/notes';

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

const EditScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route.params?.id;
  const isNew = !id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getNoteById(id).then(n => {
      if (n) {
        setTitle(n.title);
        setContent(n.content);
      }
    });
  }, [id]);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const created = await createNote({ title, content });
        navigation.replace('View', { id: created.id });
      } else {
        await updateNote(id!, { title, content });
        navigation.replace('View', { id: id! });
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input value={title} onChangeText={setTitle} placeholder="Title" style={{ marginBottom: spacing(3) }} />
      <Input value={content} onChangeText={setContent} placeholder="Write something..." multiline />

      <View style={styles.actions}>
        <Button title="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
        <Button title={saving ? 'Saving...' : 'Save'} onPress={onSave} disabled={saving} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(4),
    backgroundColor: themeColors.background
  },
  actions: {
    marginTop: spacing(4),
    flexDirection: 'row',
    gap: spacing(3),
    justifyContent: 'flex-end'
  }
});

export default EditScreen;

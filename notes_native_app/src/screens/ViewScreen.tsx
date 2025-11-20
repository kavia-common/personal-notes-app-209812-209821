import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { spacing, themeColors, cardStyle } from '../theme/theme';
import { Button, Card } from '../components/UI';
import { Note } from '../types';
import { deleteNote, getNoteById } from '../storage/notes';

type Props = NativeStackScreenProps<RootStackParamList, 'View'>;

const ViewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [note, setNote] = useState<Note | undefined>(undefined);

  useEffect(() => {
    getNoteById(id).then(setNote);
  }, [id]);

  const handleDelete = () => {
    Alert.alert('Delete note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(id);
          navigation.popToTop();
        }
      }
    ]);
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={{ color: themeColors.muted }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.meta}>Updated {new Date(note.updatedAt).toLocaleString()}</Text>
        {note.content ? <Text style={styles.content}>{note.content}</Text> : null}
      </Card>

      <View style={styles.actions}>
        <Button title="Edit" variant="secondary" onPress={() => navigation.navigate('Edit', { id })} />
        <Button title="Delete" variant="danger" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing(4),
    backgroundColor: themeColors.background,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: themeColors.text,
    marginBottom: spacing(2)
  },
  meta: {
    color: themeColors.muted,
    marginBottom: spacing(3)
  },
  content: {
    fontSize: 16,
    color: themeColors.text,
    lineHeight: 22
  },
  actions: {
    marginTop: spacing(4),
    flexDirection: 'row',
    gap: spacing(3),
    justifyContent: 'flex-end'
  }
});

export default ViewScreen;

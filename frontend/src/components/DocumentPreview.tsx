import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import type { DocumentTemplate } from 'utils/documentStore';

interface Props {
  document: DocumentTemplate;
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  field: {
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  content: {
    whiteSpace: 'pre-wrap',
  },
  signature: {
    marginTop: 50,
    borderTop: '1px solid black',
    paddingTop: 10,
  },
});

export function DocumentPreview({ document }: Props) {
  const renderSkifteattest = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Skifteattest</Text>
        
        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.label}>Fullt navn:</Text>
            <Text>{document.content.fullName}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Dødsdato:</Text>
            <Text>{document.content.dateOfDeath}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Dødssted:</Text>
            <Text>{document.content.placeOfDeath}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Siste bosted:</Text>
            <Text>{document.content.lastResidence}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Nærmeste pårørende:</Text>
            <Text>{document.content.nextOfKin}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Relasjon:</Text>
            <Text>{document.content.relationship}</Text>
          </View>
        </View>

        <View style={styles.signature}>
          <Text>Dato: {new Date().toLocaleDateString('nb-NO')}</Text>
          <Text style={{ marginTop: 30 }}>Underskrift: _________________________</Text>
        </View>
      </Page>
    </Document>
  );

  const renderFullmakt = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Fullmakt</Text>
        
        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.label}>Fullmaktsgiver:</Text>
            <Text>{document.content.grantor}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Fullmaktsgivers adresse:</Text>
            <Text>{document.content.grantorAddress}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Fullmektig:</Text>
            <Text>{document.content.attorney}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Fullmektigs adresse:</Text>
            <Text>{document.content.attorneyAddress}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Omfang:</Text>
          <Text style={styles.content}>{document.content.scope}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Varighet:</Text>
          <Text style={styles.content}>{document.content.duration}</Text>
        </View>

        <View style={styles.signature}>
          <Text>Sted og dato: _________________________</Text>
          <Text style={{ marginTop: 30 }}>Underskrift fullmaktsgiver: _________________________</Text>
          <Text style={{ marginTop: 30 }}>Underskrift fullmektig: _________________________</Text>
        </View>
      </Page>
    </Document>
  );

  const renderTestamente = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Testamente</Text>
        
        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.label}>Testator:</Text>
            <Text>{document.content.testator}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Fødselsdato:</Text>
            <Text>{document.content.dateOfBirth}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Adresse:</Text>
            <Text>{document.content.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.content}>{document.content.content}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Vitner:</Text>
          <Text style={styles.content}>{document.content.witnesses}</Text>
        </View>

        <View style={styles.signature}>
          <Text>Sted: {document.content.place}</Text>
          <Text>Dato: {document.content.date}</Text>
          <Text style={{ marginTop: 30 }}>Underskrift testator: _________________________</Text>
          <Text style={{ marginTop: 20 }}>Vitne 1: _________________________</Text>
          <Text style={{ marginTop: 20 }}>Vitne 2: _________________________</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <PDFViewer style={{ width: '100%', height: '70vh' }}>
      {document.type === 'skifteattest' && renderSkifteattest()}
      {document.type === 'fullmakt' && renderFullmakt()}
      {document.type === 'testamente' && renderTestamente()}
    </PDFViewer>
  );
}

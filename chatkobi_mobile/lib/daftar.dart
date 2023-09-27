import 'package:flutter/material.dart';
import 'package:csv/csv.dart';
import 'package:flutter/services.dart';


class DrugDetail extends StatelessWidget {
  final String drugTitle;
  final String drugStrips;

  const DrugDetail(this.drugTitle, this.drugStrips, {super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(drugTitle),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: <Widget>[
            Text('Nama Obat: $drugTitle'),
            const SizedBox(height: 16.0),
            FutureBuilder(
              future: _loadDrugContent(drugTitle),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                } else if (snapshot.hasError) {
                  return const Text('Gagal memuat isi obat.');
                } else {
                  return Text(snapshot.data.toString());
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<String> _loadDrugContent(String drugTitle) async {
    try {
      final String fileName = '${drugTitle.toLowerCase().replaceAll(' ', '-')}.txt';
      final String content = await rootBundle.loadString('drug_data/$fileName');
      return content;
    } catch (e) {
      return 'Gagal memuat isi obat.';
    }
  }
}


class DrugList extends StatefulWidget {
  const DrugList({super.key});

  @override
  _DrugListState createState() => _DrugListState();
}

class _DrugListState extends State<DrugList> {
  TextEditingController searchController = TextEditingController();
  List<List<dynamic>> drugData = [];
  List<List<dynamic>> displayedDrugs = [];

  @override
  void initState() {
    super.initState();
    _loadDrugData();
  }
  void _filterDrugs(String query) {
  setState(() {
    if (query.isEmpty) {
      displayedDrugs = List.from(drugData); 
    } else {
      displayedDrugs = drugData.where((drugInfo) {
        final drugTitle = drugInfo[0].toString().toLowerCase();
        return drugTitle.contains(query.toLowerCase());
      }).toList();
    }
  });
}


  Future<void> _loadDrugData() async {
    try {
      const String csvPath = 'drug_data/index_obat.csv';
      final String csvData = await rootBundle.loadString(csvPath);
      final List<List<dynamic>> csvTable = const CsvToListConverter().convert(csvData);

      setState(() {
        drugData = csvTable;
        displayedDrugs = List.from(drugData);
      });
    } catch (e) {
      print('Gagal memuat data obat: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Daftar Obat-Obatan'),
      ),
body: Column(
  children: [
    Padding(
      padding: const EdgeInsets.all(16.0),
      child: TextField(
        controller: searchController,
        decoration: const InputDecoration(
          hintText: 'Cari obat...',
          prefixIcon: Icon(Icons.search),
        ),
        onChanged: (value) {
          _filterDrugs(value);
        },
      ),
    ),
    Expanded(
      child: ListView.builder(
        itemCount: displayedDrugs.length,
        itemBuilder: (context, index) {
          final drugInfo = displayedDrugs[index];
          final drugTitle = drugInfo[0];
          final drugStrips = drugInfo[1];

          return ListTile(
            title: Text(drugTitle),
            subtitle: Text('Strips: $drugStrips'),
            onTap: () {

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => DrugDetail(drugTitle, drugStrips),
                )
              );
            },
          );
        },
      ),
    ),
  ],
),
);
}}
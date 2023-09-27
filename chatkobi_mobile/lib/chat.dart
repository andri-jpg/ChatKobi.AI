import 'package:flutter/material.dart';
import 'ffi.dart';


class ChatScreen extends StatefulWidget {
  const ChatScreen({Key? key}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> with SingleTickerProviderStateMixin {
  final List<ChatMessage> _messages = <ChatMessage>[];
  final TextEditingController _textController = TextEditingController();
  bool _isLoading = false;
  late AnimationController _animationController;
  late Animation<Color?> _colorTween;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );
    _colorTween = ColorTween(
      begin: Colors.blue,
      end: Colors.red, 
    ).animate(_animationController);
  }

void _handleSubmitted(String text) async {
  _textController.clear();
  ChatMessage message = ChatMessage(
    text: text,
    isUserMessage: true,
  );

  setState(() {
    _messages.insert(0, message);
    _startLoading();
  });

  await Future.delayed(const Duration(seconds: 2));

  var botResponse = text;

  setState(() {
    _messages.insert(0, ChatMessage(text: botResponse, isUserMessage: false));
  });

  _stopLoading();
}

  void handleError() {
    ChatMessage errorMessage = const ChatMessage(
      text: 'Maaf, terjadi kesalahan.', isUserMessage: false,
    );

    setState(() {
      _messages.insert(0, errorMessage);
    });
  }

  void _startLoading() {
    setState(() {
      _isLoading = true;
    });
    _animationController.repeat(); 
  }

  void _stopLoading() {
    setState(() {
      _isLoading = false;
    });
    _animationController.reset(); 
  }

  Widget _buildTextComposer() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(32.0),
      ),
      margin: const EdgeInsets.only(left: 8.0, right: 8.0, bottom: 24.0),
      child: Row(
        children: <Widget>[
          Flexible(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: TextField(
                controller: _textController,
                onSubmitted: _handleSubmitted,
                decoration: const InputDecoration.collapsed(
                  hintText: 'Ketikkan pertanyaan Anda...',
                ),
                enabled: !_isLoading,
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.send, color: _isLoading ? Colors.grey : Colors.blue),
            onPressed: _isLoading ? null : () => _handleSubmitted(_textController.text),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chat'),
      ),
      body: Column(
        children: <Widget>[
          Flexible(
            child: ListView.builder(
              padding: const EdgeInsets.all(8.0),
              reverse: true,
              itemBuilder: (_, int index) => _messages[index],
              itemCount: _messages.length,
            ),
          ),
          _buildTextComposer(),
          _isLoading
              ? AnimatedBuilder(
                  animation: _animationController,
                  builder: (context, child) {
                    return LinearProgressIndicator(
                      valueColor: _colorTween,
                      backgroundColor: Colors.grey[300],
                    );
                  },
                )
              : const SizedBox(),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}

class ChatMessage extends StatelessWidget {
  final String text;
  final bool isUserMessage;

  const ChatMessage({Key? key, required this.text, required this.isUserMessage})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            margin: const EdgeInsets.only(right: 16.0),
            child: const CircleAvatar(
              backgroundColor: Colors.blue,
              child: Icon(
                Icons.person,
                color: Colors.white,
                size: 24.0,
              ),
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  isUserMessage ? 'Anda' : 'AI',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontFamily: 'oxygen',
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 5.0),
                  child: Text(text),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime

# 创建Flask应用
app = Flask(__name__)
CORS(app)  # 启用跨域支持

print("=" * 50)
print("🎤 心语安情绪识别API服务")
print("=" * 50)
print("📡 本地访问地址: http://localhost:5000")
print("🔗 健康检查: GET http://localhost:5000/api/health")
print("🔗 文本情绪分析: POST http://localhost:5000/api/analyze/text")
print("🔗 音频情绪分析: POST http://localhost:5000/api/analyze/audio")
print("=" * 50)

# 情绪映射
emotion_map = {
    "happy": "快乐",
    "sad": "悲伤", 
    "angry": "愤怒",
    "fear": "害怕",
    "surprise": "惊讶",
    "disgust": "厌恶",
    "neutral": "平静",
    "unknown": "未知"
}

@app.route('/')
def index():
    """首页"""
    return jsonify({
        "service": "心语安情绪识别API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health_check": "GET /api/health",
            "text_analysis": "POST /api/analyze/text",
            "audio_analysis": "POST /api/analyze/audio"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        "status": "healthy",
        "service": "emotion-recognition-api",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/analyze/text', methods=['POST'])
def analyze_text():
    """文本情绪分析接口（模拟）"""
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 📨 收到文本分析请求")
    
    try:
        # 获取请求数据
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({
                "code": 400,
                "error": "文本内容为空",
                "message": "请提供要分析的文本"
            }), 400
        
        print(f"📝 分析文本: {text[:50]}...")
        
        # 简单的基于关键词的情绪分析（模拟）
        emotion_keywords = {
            '快乐': ['开心', '高兴', '快乐', '幸福', '愉快', '兴奋', '哈哈', '呵呵'],
            '平静': ['平静', '安静', '平和', '稳定', '正常', '一般'],
            '焦虑': ['焦虑', '紧张', '担心', '忧虑', '着急', '心烦'],
            '悲伤': ['悲伤', '难过', '伤心', '哭泣', '痛苦', '抑郁'],
            '愤怒': ['愤怒', '生气', '发火', '气愤', '恼火', '烦躁']
        }
        
        detected_emotion = '平静'  # 默认情绪
        max_count = 0
        
        for emotion, keywords in emotion_keywords.items():
            count = sum(1 for keyword in keywords if keyword in text)
            if count > max_count:
                max_count = count
                detected_emotion = emotion
        
        # 计算置信度
        confidence = min(0.3 + max_count * 0.2, 0.85)
        
        result = {
            "emotion": detected_emotion,
            "confidence": confidence,
            "text_length": len(text),
            "keyword_matches": max_count
        }
        
        print(f"✅ 文本分析完成: {detected_emotion} (置信度: {confidence:.2%})")
        
        return jsonify({
            "code": 200,
            "data": result,
            "message": "文本情绪分析成功",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ 处理异常: {str(e)}")
        return jsonify({
            "code": 500,
            "error": str(e),
            "message": "服务器内部错误"
        }), 500

@app.route('/api/analyze/audio', methods=['POST'])
def analyze_audio():
    """音频情绪分析接口（模拟）"""
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 📨 收到音频分析请求")
    
    try:
        # 这里应该处理音频文件上传
        # 暂时先返回模拟数据
        import random
        
        emotions = ['快乐', '平静', '焦虑', '悲伤', '愤怒']
        emotion = random.choice(emotions)
        confidence = round(0.7 + random.random() * 0.2, 2)
        
        result = {
            "emotion": emotion,
            "confidence": confidence,
            "features": {
                "vad_ratio": round(random.random(), 2),
                "f0_mean": round(200 + random.random() * 100, 2),
                "f0_std": round(random.random() * 50, 2)
            }
        }
        
        print(f"✅ 音频分析完成: {emotion} (置信度: {confidence:.2%})")
        
        return jsonify({
            "code": 200,
            "data": result,
            "message": "音频情绪分析成功",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ 处理异常: {str(e)}")
        return jsonify({
            "code": 500,
            "error": str(e),
            "message": "服务器内部错误"
        }), 500

if __name__ == '__main__':
    print("\n🚀 正在启动情绪识别API服务...")
    print("⚠️  注意: 请勿关闭此窗口，保持服务运行")
    print("=" * 50)
    
    # 启动Flask应用
    app.run(
        host='0.0.0.0',    # 允许所有IP访问
        port=5000,         # 端口号
        debug=True,        # 调试模式
        threaded=True      # 多线程处理
    )
import ReactMarkDown from 'react-markdown';
import guideContent from '../markdown/guide.md?raw';
import '../css/pages/UserGuide.css';

export default function UserGuide() {
    return (
        <div className="guide-page">
            <h1 className="guide-title">User Guide</h1>
            <div className="markdown">
                <ReactMarkDown>{guideContent}</ReactMarkDown>
            </div>
        </div>
    );
}
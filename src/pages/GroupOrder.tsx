import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../store/useStore';
import { Share2, Copy, ArrowRight, Link as LinkIcon, Check } from 'lucide-react';

export default function GroupOrder() {
  const navigate = useNavigate();
  const tableId = useStore(state => state.tableId);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [shareError, setShareError] = useState(false);

  if (!tableId) {
    navigate('/scan');
    return null;
  }

  // Generate a unique group ID using table ID and timestamp
  const groupId = `${tableId}-${Date.now()}`;
  const shareUrl = `${window.location.origin}/join-group/${groupId}`;

  const handleShare = async () => {
    if (!navigator.share) {
      handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: 'Join our group order at Quisin',
        text: 'Click here to join our group order!',
        url: shareUrl
      });
    } catch (err) {
      // If sharing fails (e.g., user cancels or permission denied), fall back to copy
      if (err instanceof Error && err.name !== 'AbortError') {
        setShareError(true);
        handleCopyLink();
        setTimeout(() => setShareError(false), 3000);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(() => {
        // If clipboard API fails, show the URL in a prompt
        window.prompt('Copy this link:', shareUrl);
      });
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Group Order</h1>
          <p className="text-gray-600">Share this QR code or link with your friends to order together</p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-lg shadow-inner">
              <QRCodeSVG
                value={shareUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Share buttons */}
          <div className="space-y-3">
            {navigator.share && (
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share Group Order
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              {showCopiedMessage ? (
                <>
                  <Check className="w-5 h-5" />
                  Link Copied!
                </>
              ) : (
                <>
                  <LinkIcon className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {shareError && (
            <p className="text-orange-600 text-sm text-center mt-3">
              Couldn't share directly. Link copied to clipboard instead!
            </p>
          )}
        </div>

        {/* Continue to Menu */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ready to start ordering?</p>
          <button
            onClick={() => navigate('/single-order')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors mx-auto"
          >
            Continue to Menu
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
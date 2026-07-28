'use client';

import React from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileCaptchaProps {
  onSuccess: (token: string) => void;
  onError?: (error?: unknown) => void;
  onExpire?: () => void;
  className?: string;
}

export const TurnstileCaptcha = React.forwardRef<TurnstileInstance | undefined, TurnstileCaptchaProps>(
  ({ onSuccess, onError, onExpire, className }, ref) => {
    const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || '1x00000000000000000000AA';

    return (
      <div className={`flex justify-center my-3 ${className || ''}`}>
        <Turnstile
          ref={ref}
          siteKey={siteKey}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
          options={{
            theme: 'auto',
            size: 'normal',
          }}
        />
      </div>
    );
  }
);

TurnstileCaptcha.displayName = 'TurnstileCaptcha';

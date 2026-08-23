'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type ShimmerImageProps = Omit<ImageProps, 'onLoad' | 'onError' | 'placeholder'> & {
    /** When present, the blur stands in for the shimmer and fills the box itself. */
    blurDataURL?: string;
};

/**
 * A photo that holds a shimmer in its own box until it has decoded, then fades
 * in. Without it a lazy or still-downloading image leaves a hole the size of
 * the layout it reserved, which reads as broken rather than as loading. An
 * error settles it too — a dead URL should not shimmer forever.
 *
 * Must sit inside a positioned container: like `fill` images, the shimmer is
 * absolutely positioned against it.
 */
const ShimmerImage: React.FC<ShimmerImageProps> = ({
    className = '',
    blurDataURL,
    style,
    ...props
}) => {
    const [settled, setSettled] = useState(false);

    return (
        <>
            {!settled && !blurDataURL && (
                // position/radius inline: .aurora-skel's own rules are declared
                // after Tailwind's utilities and would win over classes here.
                <div
                    className="aurora-skel"
                    style={{ position: 'absolute', inset: 0, borderRadius: 0, border: 'none' }}
                    aria-hidden="true"
                />
            )}
            <Image
                {...props}
                placeholder={blurDataURL ? 'blur' : 'empty'}
                blurDataURL={blurDataURL}
                onLoad={() => setSettled(true)}
                onError={() => setSettled(true)}
                className={`aurora-shimmer-img ${className}`.trim()}
                // Inline, so no utility class or rule can leave a decoded photo
                // stuck at zero. The fade itself lives on .aurora-shimmer-img.
                style={{ ...style, opacity: settled ? 1 : 0 }}
            />
        </>
    );
};

export default ShimmerImage;

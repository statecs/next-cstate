import {ImageResponse} from '@vercel/og';

export const getOgImage = async (photos: string[]) => {
    return new ImageResponse(
        (
            <div tw="relative flex w-full flex-col items-center justify-center bg-white">
                <div tw="flex w-full bg-white h-full flex-wrap">
                    {photos.map((photo, index) => {
                        const className =
                            photos.length > 1
                                ? `flex w-full bg-gray-100 w-1/2 h-1/2 bg-cover bg-center bg-no-repeat ${
                                      index % 2 === 0 ? 'border-r-4 border-white' : ''
                                  } ${index < 2 ? 'border-b-4 border-white' : ''}`
                                : 'bg-no-repeat bg-cover bg-center bg-no-repeat w-full h-full absolute';

                        return (
                            <div
                                key={photo}
                                tw={className}
                                style={photos.length > 1 ? {
                                    backgroundImage: `url(${photo
                                        .replace('fm=webp', '')
                                        .replace('w=1800', 'w=800')})`,
                                    backgroundSize: '100% 130%',
                                    backgroundPosition: '0 -15%'
                                } : {
                                    backgroundImage: `url(${photo
                                        .replace('fm=webp', '')
                                        .replace('w=1800', 'w=800')})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat', 
                                    transform: 'scale(1.5)', 
                                    transformOrigin: 'left top',
                                }}
                            />
                        );
                    })}
                </div>
                <div
                    style={{
                        backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/og-logo.png)`,
                        backgroundSize: '100% 100%'
                    }}
                    tw="absolute bottom-2 right-2 h-10 w-10"
                />
            </div>
        ),
        {width: 1200, height: 630}
    );
};

import React from 'react'
import { CheckBadgeIcon, AdjustmentsVerticalIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/20/solid'
import FeatureImg from '../../assets/features-image.jpg'
const Featured = () => {
  const features = [
    {
      name: 'Ease-of-use',
      description:
        'Start Renting with a click of a button with 24/7 support for any disputes.',
      icon: CheckBadgeIcon,
    },
    {
      name: 'Support for all instruments',
      description:
        'Choose from a range of categories - from acoustic guitars to large scale orchestra instruments.',
      icon: ShieldCheckIcon,
    },
    
    {
      name: 'Highly Reliable',
      description:
        'Set your own checks, verifications, and upload before and after pictures.',
      icon: AdjustmentsVerticalIcon,
    },
    {
      name: 'Join a community',
      description:
        'Join a community of fellow musicians and discuss all things music.',
      icon: UserGroupIcon,
    },
  ]
  return (
		<>
			<div className="overflow-hidden bg-bg-primary py-24 sm:py-32 h-[60rem]">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 h-1/2 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
						<div className="lg:pr-8 lg:pt-4">
							<div className="lg:max-w-lg">
								<p className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
									Rentals made easy
								</p>
								<dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-200 lg:max-w-none">
									{features.map((feature) => (
										<div key={feature.name} className="relative pl-9">
											<dt className="inline font-semibold text-btn-primary">
												<feature.icon
													className="absolute left-1 top-1 h-5 w-5 text-btn-important"
													aria-hidden="true"
												/>
												{feature.name}
											</dt>{" "}
											<dd className="inline">{feature.description}</dd>
										</div>
									))}
								</dl>
							</div>
						</div>
						<img
							src={FeatureImg}
							alt="Product screenshot"
							className=" h-2/3 max-w-1/2 rounded-xl shadow-xl object-cover ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
							width={800}
							height={600}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default Featured
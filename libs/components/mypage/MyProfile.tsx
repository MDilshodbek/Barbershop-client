import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useTranslation } from 'react-i18next';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		setUpdateData({
			...updateData,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberImage: user.memberImage,
		});
	}, [user]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			updateData.memberImage = responseImage;
			setUpdateData({ ...updateData });

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const updatePropertyHandler = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			updateData._id = user._id;
			const result = await updateMember({
				variables: {
					input: updateData,
				},
			});

			// @ts-ignore
			const jwtToken = result.data.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);
			await sweetMixinSuccessAlert(t('information updated successfully'));
		} catch (error: any) {
			sweetErrorHandling(error).then();
		}
	}, [updateData]);

	const doDisabledCheck = () => {
		if (updateData.memberNick === '' || updateData.memberPhone === '') {
			return true;
		}
	};

	if (device === 'mobile') {
		return (
			<div id="my-profile-page-mobile">
				<Stack className="photo-box-mobile">
					<Stack className="image-box">
						<img
							src={
								updateData?.memberImage
									? `${REACT_APP_API_URL}/${updateData?.memberImage}`
									: `/logo/defaultUser.svg`
							}
							alt=""
						/>
					</Stack>
					<input
						type="file"
						hidden
						id="hidden-input-mobile"
						onChange={uploadImage}
						accept="image/jpg, image/jpeg, image/png"
					/>
					<label htmlFor="hidden-input-mobile" className="labeler">
						{t('Upload Profile Image')}
					</label>
					<Typography className="upload-text">{t('A photo must be in JPG, JPEG or PNG format!')}</Typography>
				</Stack>

				<Stack className="form-mobile">
					<Stack className="input-box">
						<Typography className="title">{t('Username')}</Typography>
						<input
							type="text"
							placeholder={t('Your username')}
							value={updateData.memberNick}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
						/>
					</Stack>
					<Stack className="input-box">
						<Typography className="title">{t('Phone')}</Typography>
						<input
							type="text"
							placeholder={t('Your Phone')}
							value={updateData.memberPhone}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
						/>
					</Stack>
					<Stack className="input-box">
						<Typography className="title">{t('Address')}</Typography>
						<input
							type="text"
							placeholder={t('Your address')}
							value={updateData.memberAddress}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
						/>
					</Stack>
					<Button className="update-button" onClick={updatePropertyHandler} disabled={doDisabledCheck()}>
						{t('Update Profile')}
					</Button>
				</Stack>
			</div>
		);
	} else
		return (
			<div id="my-profile-page">
				<Stack className="top-box">
					<Stack className="photo-box">
						<Typography className="title">{t('Photo')}</Typography>
						<Stack className="image-big-box">
							<Stack className="image-box">
								<img
									src={
										updateData?.memberImage
											? `${REACT_APP_API_URL}/${updateData?.memberImage}`
											: `/logo/defaultUser.svg`
									}
									alt=""
								/>
							</Stack>
							<Stack className="upload-big-box">
								<input
									type="file"
									hidden
									id="hidden-input"
									onChange={uploadImage}
									accept="image/jpg, image/jpeg, image/png"
								/>
								<label htmlFor="hidden-input" className="labeler">
									<Typography>{t('Upload Profile Image')}</Typography>
								</label>
								<Typography className="upload-text">{t('A photo must be in JPG, JPEG or PNG format!')}</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="small-input-box">
						<Stack className="input-box">
							<Typography className="title">{t('Username')}</Typography>
							<input
								type="text"
								placeholder={t('Your username')}
								value={updateData.memberNick}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
							/>
						</Stack>
						<Stack className="input-box">
							<Typography className="title">{t('Phone')}</Typography>
							<input
								type="text"
								placeholder={t('Your Phone')}
								value={updateData.memberPhone}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
							/>
						</Stack>
					</Stack>
					<Stack className="address-box">
						<Typography className="title">{t('Address')}</Typography>
						<input
							type="text"
							placeholder={t('Your address')}
							value={updateData.memberAddress}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
						/>
					</Stack>
					<Stack className="about-me-box">
						<Button className="update-button" onClick={updatePropertyHandler} disabled={doDisabledCheck()}>
							<Typography>{t('Update Profile')}</Typography>
						</Button>
					</Stack>
				</Stack>
			</div>
		);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
	},
};

export default MyProfile;

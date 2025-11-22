import { PersonalDataQuery, PersonalDataQueryVariables } from 'types/graphql'

import {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
  useMutation,
} from '@redwoodjs/web'
import {
  CheckboxField,
  DateField,
  FieldError,
  Form,
  InputField,
  Label,
  SelectField,
  Submit,
  SubmitHandler,
  useForm,
} from '@redwoodjs/forms'
import React from 'react'
import Skeleton from 'src/components/Skeleton/Skeleton'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'

export const QUERY: TypedDocumentNode<
  PersonalDataQuery,
  PersonalDataQueryVariables
> = gql`
  query PersonalDataQuery {
    personalData {
      id
      name
      familyName
      birthdate
      gender
      phoneNumber
      phoneCaretakerContact
      isParent
      city
      country
      address
      postalCode
      role
    }
  }
`

const UPDATE_PERSONALDATA = gql`
  mutation UpdatePersonalDataMutation($input: UpdatePersonalDataInput!) {
    updatePersonalData(input: $input) {
      id
      name
      familyName
      birthdate
      gender
      phoneNumber
      phoneCaretakerContact
      isParent
      city
      country
      address
      postalCode
      role
    }
  }
`

export const Loading = () => (
  <div className="my-4 mx-0 max-w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Skeleton type="title" className="col-span-2 mb-4" />
    <Skeleton type="input" />
    <Skeleton type="input" />
    <Skeleton type="input" />
    <Skeleton type="input" />
    <Skeleton type="input" />
    <Skeleton type="input" />
    <Skeleton type="select" />
    <Skeleton type="input" />
    <Skeleton type="input" />
    <Skeleton type="input" />
    <Skeleton type="checkbox" />
  </div>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<PersonalDataQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  personalData,
}: CellSuccessProps<PersonalDataQuery, PersonalDataQueryVariables>) => {
  const { currentUser } = useAuth()
  const formMethods = useForm({
    mode: 'onBlur',
    resolver: null,
  })
  const [update, { loading, error }] = useMutation<
    UpdatePersonalDataMutation,
    UpdatePersonalDataMutationVariables
  >(UPDATE_PERSONALDATA, {
    onCompleted: () => {
      toast.success('Deine Persönlichen Daten wurde gespeichert')
    },
  })

  const updatePersonalData: SubmitHandler<FormValues> = async (data) => {
    console.log(data)
    await update({ variables: { id: currentUser.sub, input: data } })
  }

  return (
    <section>
      <h1>Persönliche Daten</h1>
      <Form
        className="my-4 mx-0 max-w-full grid grid-cols-1 sm:grid-cols-2 gap-4"
        formMethods={formMethods}
        onSubmit={updatePersonalData}
      >
        <div>
          <Label name={'name'} errorClassName={'error'}>
            Vorname
          </Label>
          <InputField
            name="name"
            defaultValue={personalData?.name}
            disabled
            errorClassName={'error'}
          ></InputField>
        </div>

        <div>
          <Label name={'familyName'} errorClassName={'error'}>
            Vorname
          </Label>
          <InputField
            name="familyName"
            defaultValue={personalData?.familyName}
            disabled
            errorClassName="error"
          />
        </div>

        <div>
          <Label name={'birthdate'} errorClassName={'error'}>
            Geburtsdatum
          </Label>
          <DateField
            name="birthdate"
            defaultValue={personalData?.birthdate?.slice(0, 10)}
            disabled
            errorClassName="error"
          />
        </div>

        <div>
          <Label name={'gender'} errorClassName={'error'}>
            Geschlecht
          </Label>
          <InputField
            name="gender"
            defaultValue={personalData?.gender}
            disabled
            errorClassName="error"
          />
        </div>

        <div>
          <Label name={'phoneNumber'} errorClassName={'error'}>
            Handynummer
          </Label>
          <InputField
            name={'phoneNumber'}
            validation={{ required: true }}
            placeholder="+43 111 22223333"
            defaultValue={personalData?.phoneNumber}
            errorClassName={'error'}
          ></InputField>
          <FieldError name="phoneNumber" className="error ms-2" />
        </div>

        <div>
          <Label name={'phoneCaretakerContact'} errorClassName={'error'}>
            Handynummer deines Erziehungsberechtigten
            <p className="secondary">für unter 18 verpflichtend</p>
          </Label>
          <InputField
            name={'phoneCaretakerContact'}
            placeholder="+43 111 22223333"
            defaultValue={personalData?.phoneCraetakerContact || ''}
            errorClassName={'error'}
          ></InputField>
          <FieldError name="phoneCaretakerContact" className="error ms-2" />
        </div>

        <div className="mt-4">
          <Label name="country" errorClassName="error">
            Woher kommst du?
          </Label>
          <SelectField
            name="country"
            validation={{ required: true }}
            defaultValue={personalData?.country}
            errorClassName="error"
          >
            <option value="" disabled selected={true}>
              Bitte wählen Sie
            </option>
            <option value="AT">Österreich</option>
            <option value="DE">Deutschland</option>
            <option value="IT">Italien</option>
            <option value="FR">Frankreich</option>
            <option value="HU">Ungarn</option>
            <option value="CH">Schweiz</option>
            <option value="LU">Luxemburg</option>
            <option value="--">Anderes</option>
          </SelectField>
        </div>

        <div className="flex flex-row gap-4">
          <InputField
            className="w-1/4"
            name="postalCode"
            defaultValue={personalData?.postalCode}
            validation={{ required: true }}
            errorClassName="error w-1/4"
            placeholder="PLZ"
          />
          <InputField
            className="w-3/4"
            name="city"
            defaultValue={personalData?.city}
            validation={{ required: true }}
            errorClassName="error w-3/4"
            placeholder="Stadt"
          />
        </div>

        <InputField
          name="address"
          defaultValue={personalData?.address}
          validation={{ required: true }}
          errorClassName="error"
          placeholder="Straße, Hausnummer"
        />

        <div className="flex">
          <div className="flex items-center h-5">
            <CheckboxField
              name="isParent"
              defaultChecked={personalData?.isParent}
            />
          </div>
          <div>
            <Label name="acceptPhotos">
              Ich ein Elternteil, das selber nicht aufs Jugendtreffen fährt
            </Label>
          </div>
        </div>
        <Submit className="primary w-fit">Speichern</Submit>
      </Form>
    </section>
  )
}

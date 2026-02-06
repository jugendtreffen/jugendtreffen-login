// import { Link, routes } from '@redwoodjs/router'
import { useState } from 'react'
import { DateField, FieldError, InputField, Label, SelectField, SubmitHandler, useForm } from '@redwoodjs/forms'
import { Metadata, useMutation } from '@redwoodjs/web'
import { LucideFileChartColumnIncreasing } from 'lucide-react'
import { useAuth } from 'src/auth'
import { useAlert } from 'src/components/Alert/AlertContext'
import Card from 'src/components/Card/Card'
import MultiStepForm from 'src/components/MultiStepForm/MultiStepForm'
import Step from 'src/components/MultiStepForm/Step'
import { CreatePersonalDataMutation, CreatePersonalDataMutationVariables } from 'types/graphql'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'
import { data } from 'autoprefixer'

const FIND_OR_CREATE_PERSONALDATA = gql`
  mutation FindOrCreatePersonalData($input: FindOrCreatePersonalDataInput!) {
    findOrCreatePersonalData(input: $input) {
      id
      name
      familyName
      birthdate
      gender
      phoneNumber
      phoneCaretakerContact
      foundUsBy
      isParent
      country
      city
      postalCode
      address
      role
      createdAt
    }
  }
`

interface FormValues {
  id: string
  email: string
  password: string
  password_ctl: string
  name: string
  familyName: string
  birthdate: Date
  gender: string
  phoneNumber: string
  phoneCaretakerContact: string
  foundUsBy: string
  isParent: boolean
  country: string
  city: string
  postalCode: string
  address: string
  role: string
}

const EventRegistrationPage = () => {
  const { client, isAuthenticated, userMetadata } = useAuth()
  const { addAlert, removeAllAlerts } = useAlert()
  const [isMinor, setMinor] = useState(false)
  const [signupCompleted, setSignupCompleted] = useState(false)

  const formMethods = useForm({
    mode: 'onBlur',
    resolver: null
  })

  const validateBirthDate = (value) => {
    const max_bd = new Date(new Date().getFullYear() - 13, 7, 31)
    const minor_bd = new Date(new Date().getFullYear() - 18, 7, 31)

    if (value >= minor_bd) {
      setMinor(true)
    } else {
      setMinor(false)
    }
    if (value >= max_bd) {
      return 'Teilnehmende müssen mindestens 14 Jahre alt sein oder in diesem Schuljahr (2024/25) die 8. Schulstufe besucht haben. Stichtag ist der 31.08.2011. Eine Teilnahme ist bis zum 30. Lebensjahr möglich.'
    }
  }
  const [findOrCreatePersonalData, { loading }] = useMutation(
    FIND_OR_CREATE_PERSONALDATA,
    {
      onCompleted: (data) => {
        setSignupCompleted(true)
        formMethods.reset()
        console.log('Found personal data in database, id: ', data.getPersonalData.id)
      }
    }
  )

  const onSubmit: SubmitHandler<FormValues> = async (input) => {
    removeAllAlerts();
    input.role = 'user';
    findOrCreatePersonalData({
      variables: {
        input: {
          name: input.name,
          familyName: input.familyName,
          birthdate: input.birthdate,
          gender: input.gender,
          phoneNumber: input.phoneNumber,
          phoneCaretakerContact: input.phoneCaretakerContact,
          foundUsBy: input.foundUsBy,
          isParent: input.isParent,
          country: input.country,
          city: input.city,
          postalCode: input.postalCode,
          address: input.address,
          role: input.role,
        }
      }
    })

    try {
      const response = await client.auth.signUp({
        email: input.email,
        password: input.password,
      })
      response?.error?.message
        ? addAlert(response.error.message, 'error')
        : (input.id = response.data.user.id)
    } catch (error) {
      addAlert(error.message, 'error')
    }
    const { email, password, password_ctl, ...personalData } = input
    await create({ variables: { input: personalData } }).catch((error) => {
      addAlert(error.message, 'error')
    })
  }

  return (
    <>
      <Metadata title="Jugendtreffen-Anmeldung" />

      <Card className="mx-auto w-full max-w-2xl flex flex-col gap-4 my-12">
        <h1>Anmeldung Jugendtreffen</h1> {/* TODO: Datum von aktuellen Jugendtreffen anzeigen - Datenbank so erweitern, dass man das aktuell laufende Jugendtreffen anzeigen kann*/}
        <MultiStepForm className="space-y-4 md:space-y-6" finishText="Anmelden" onSubmit={onSubmit} disableSubmit={null} formMethods={formMethods}>
          <Step>
            <p className="secondary text-end">Schritt: 1/2</p>
            <InputField
              name="name"
              placeholder="Vorname"
              validation={{ required: true }}
              errorClassName="error"
            />
            <InputField
              name="familyName"
              placeholder="Familienname"
              validation={{ required: true }}
              errorClassName="error"
            />
            <div>
              <Label name={'birthdate'} errorClassName={'error'}>
                Geburtsdatum
              </Label>
              <DateField
                name={'birthdate'}
                max={Date.now()}
                validation={{
                  required: {
                    value: true,
                    message: 'Bitte gebe dein Geburtsdatum an',
                  },
                  validate: validateBirthDate,
                }}
                errorClassName="error"
              />
              <FieldError name={'birthdate'} className={'error'} />
            </div>
            <div>
              <Label name={'phoneNumber'} errorClassName={'error'}>
                Handynummer
              </Label>
              <InputField
                name={'phoneNumber'}
                validation={{ required: true }}
                placeholder="+43 1234 12345678 "
                errorClassName={'error'}
              ></InputField>
            </div>
            <div>
              <Label name={'phoneCaretakerContact'} errorClassName={'error'}>
                Handynummer deines Erziehungsberechtigten
                <p className="secondary">für unter 18 verpflichtend</p>
              </Label>
              <InputField
                name={'phoneCaretakerContact'}
                validation={{ required: isMinor }}
                placeholder="+43 1234 12345678 "
                errorClassName={'error'}
              ></InputField>
            </div>
            <div>
              <Label name={'gender'} errorClassName={'error'}>
                Geschlecht
              </Label>
              <SelectField
                name={'gender'}
                validation={{ required: true }}
                errorClassName={'error'}
              >
                <option value="" disabled selected={true}>
                  Bitte wählen Sie
                </option>
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
              </SelectField>
            </div>
          </Step>
          <Step>
            <p className="secondary text-end">Schritt: 2/2</p>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="mt-4">
                  <Label name="country" errorClassName="error">
                    Woher kommst du?
                  </Label>
                  <SelectField
                    name="country"
                    validation={{ required: true }}
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
                    validation={{ required: true }}
                    errorClassName="error w-1/4"
                    placeholder="PLZ"
                  />
                  <InputField
                    className="w-3/4"
                    name="city"
                    validation={{ required: true }}
                    errorClassName="error w-3/4"
                    placeholder="Stadt"
                  />
                </div>

                <InputField
                  name="address"
                  validation={{ required: true }}
                  errorClassName="error"
                  placeholder="Straße, Hausnummer"
                />
              </>
            )}
          </Step>
        </MultiStepForm>
      </Card>
    </>
  )
}



export default EventRegistrationPage

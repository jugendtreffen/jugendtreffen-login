const RegistrationForm = () => {
  return (
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
                max={new Date().toISOString().slice(0, 10)}
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
          </Step>
          <Step>
            <p className="secondary text-end">Schritt: 2/2</p>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <><></><div>
                <Label name="travelMethod" errorClassName="error">
                  Anreise<span className="font-bold text-primary-500">*</span>
                </Label>
                <SelectField
                  name="travelMethod"
                  validation={{
                    required: {
                      value: true,
                      message: 'Irgendwie musst du nach Kremsmünster finden...',
                    },
                  }}
                  errorClassName="error"
                >
                  <option value="" disabled selected={true}>
                    Bitte wählen Sie
                  </option>
                  <option value="auto">mit dem Auto</option>
                  <option value="zug">mit dem Zug</option>
                </SelectField>
                <FieldError name="travelMethod" className="error ms-2" />
              </div><div>
                  <Label name="participationRoleId" errorClassName="error">
                    Ich nehme Teil als
                    <span className="font-bold text-primary-500">*</span>
                  </Label>
                  <SelectField
                    name="participationRoleId"
                    validation={{
                      required: {
                        value: true,
                        message: 'Wähle wie du deine Zeit am Jugendtreffen verbringen wirst',
                      },
                    }}
                    onChange={(value) => {
                      setAccomodationCheck({
                        role: value.target.value,
                        accommodation: accomodationCheck.accommodation,
                      })
                    }}
                    errorClassName="error"
                  >
                    <option value="" disabled selected={true}>
                      Bitte wählen Sie
                    </option>
                    <option value="Teilnehmer">Teilnehmer</option>
                    <option value="Priester">Priester</option>
                    <option value="Begleitperson">Begleitperson</option>
                    <option value="Vortragender">Vortragender</option>
                    <option value="Ordensmann/Ordensfrau">Ordensmann/Ordensfrau</option>
                  </SelectField>
                  <FieldError name="participationRoleId" className="error ms-2" />
                </div><div>
                  <div className="label">
                    Ich brauche...
                    <span className="font-bold text-primary-500">*</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center ps-4 rounded border border-gray-700">
                      <RadioField
                        id="yes-acc"
                        name="accommodation"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus wo du übernachten wirst',
                          },
                        }}
                        value="true"
                        onChange={() => setAccomodationCheck({
                          role: accomodationCheck.role,
                          accommodation: true,
                        })} />
                      <Label
                        name="accommodation"
                        htmlFor="yes-acc"
                        className="w-full py-3 text-sm mb-0"
                      >
                        eine Unterkunft
                      </Label>
                    </div>
                    <div className="flex items-center ps-4 rounded border border-gray-700">
                      <RadioField
                        id="no-acc"
                        name="accommodation"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus wo du übernachten wirst',
                          },
                        }}
                        value="false"
                        onChange={() => setAccomodationCheck({
                          role: accomodationCheck.role,
                          accommodation: false,
                        })} />
                      <Label
                        name="accommodation"
                        htmlFor="no-acc"
                        className="w-full py-3 text-sm mb-0"
                      >
                        keine Unterkunft
                      </Label>
                    </div>
                  </div>

                  {shouldDisplayAccomodationLocation() && (
                    <>
                      <div className="label mt-2">Im...</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center ps-4 rounded border border-gray-700">
                          <RadioField
                            id="subiaco"
                            name="accommodationLocation"
                            errorClassName="error"
                            validation={{
                              required: {
                                value: true,
                                message: 'Wähle aus wo du übernachten wirst',
                              },
                            }}
                            value="subiaco" />
                          <Label
                            name="acccommodationLocation"
                            htmlFor="yes-acc"
                            className="w-full py-3 text-sm mb-0"
                          >
                            Haus Subiaco
                            <p className="secondary font-light">
                              Unterbringung im Haus Subiaco
                              <br />
                              Einzelzimmer, Bad am Gang 30€ / Nacht
                            </p>
                          </Label>
                        </div>
                        <div className="flex items-center ps-4 rounded border border-gray-700">
                          <RadioField
                            id="privatquartier"
                            name="accommodationLocation"
                            errorClassName="error"
                            validation={{
                              required: {
                                value: true,
                                message: 'Wähle aus wo du übernachten wirst',
                              },
                            }}
                            value="privatquartier" />
                          <Label
                            name="accomodationLocation"
                            htmlFor="no-acc"
                            className="w-full py-3 text-sm mb-0"
                          >
                            Privatquartier
                            <p className="secondary font-light">
                              Unterbringung bei Familie in Umgebung von Kremsmünster Kann
                              bis zu 20 km entfernt sein (Auto benötigt).
                              <br />
                              Vergabe näherer Quartiere nach Bedarf. kostenfrei
                            </p>
                          </Label>
                        </div>
                      </div>
                    </>
                  )}

                  <FieldError name="accommodation" className="error ms-2" />
                </div><div>
                  <div className="label">
                    Ich bin anwesend von...
                    <span className="font-bold text-primary-500">*</span>
                  </div>

                  <div
                    id="date-range-picker"
                    className="flex items-center flex-wrap gap-2"
                  >
                    <div className="relative">
                      <DateField
                        name="startDate"
                        className="border text-sm rounded-lg block w-full ps-5 p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        errorClassName="error"
                        validation={{
                          required: { value: true, message: 'Wann kommst du?' },
                          validate: validateStartDate,
                        }}
                        defaultValue={START_DATE} />
                      <FieldError name="startDate" className="error ms-2" />
                    </div>
                    <span>bis</span>
                    <div className="relative">
                      <DateField
                        name="endDate"
                        className="border text-sm rounded-lg block w-full ps-5 p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        errorClassName="error"
                        validation={{
                          required: { value: true, message: 'Wann fährtst du heim?' },
                          validate: validateEndDate,
                        }}
                        defaultValue={END_DATE} />
                      <FieldError name="endDate" className="error ms-2" />
                    </div>
                  </div>
                  <p className={'secondary mt-2'}>
                    Jugendtreffen findet von {START_DATE} bis{' '}
                    {END_DATE} statt
                  </p>
                </div><div>
                  <div className="label">
                    Ich esse...<span className="font-bold text-primary-500">*</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center ps-4 border rounded border-gray-700">
                      <RadioField
                        id="alles"
                        name="foodChoice"
                        value="alles"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus was du essen magst',
                          },
                        }} />
                      <Label
                        name="foodChoice"
                        htmlFor="alles"
                        className="w-full py-3 text-sm mb-0"
                      >
                        eigentlich alles
                      </Label>
                    </div>
                    <div className="flex items-center ps-4 border rounded border-gray-700">
                      <RadioField
                        id="veggi"
                        name="foodChoice"
                        value="vegetarisch"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus was du essen magst',
                          },
                        }} />
                      <Label
                        htmlFor="veggi"
                        name="foodChoice"
                        className="w-full py-3 text-sm mb-0"
                      >
                        nur vegetarisch
                      </Label>
                    </div>
                  </div>
                  <FieldError name="foodChoice" className="error ms-2" />
                </div><div>
                  <div className="flex items-center">
                    <CheckboxField
                      name="acceptCoC"
                      errorClassName="error"
                      validation={{
                        required: {
                          value: true,
                          message: 'Akzeptiere den Verhaltenscodex um teilzunehmen!',
                        },
                        valueAsBoolean: true,
                      }}
                      disabled={!hasOpenedLink} />
                    <Label name="acceptCoC" className="ms-2">
                      Ich habe den{' '}
                      <a
                        onClick={() => setHasOpenedLink(true)}
                        href="https://jugendtreffen.at/wp-content/uploads/2024/03/Verhaltenskodex-fu%CC%88r-Teilnehmende-2024.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link text-accent inline-flex"
                      >
                        Verhaltenscodex
                        <Info />
                      </a>{' '}
                      gelesen und akzeptiere diesen.
                      <span className="font-bold text-primary-500">*</span>
                    </Label>
                  </div>
                  <FieldError name="acceptCoC" className="ms-6 error"></FieldError>
                </div><div className="flex">
                  <div className="flex items-center h-5">
                    <CheckboxField
                      name="acceptPhotos"
                      validation={{
                        required: true,
                        valueAsBoolean: true,
                      }}
                      errorClassName="error" />
                  </div>
                  <div>
                    <Label name="acceptPhotos">
                      Ich stimme zu, fotografiert oder gefilmt werden zu dürfen.
                      <span className="font-bold text-primary-500">*</span>
                    </Label>
                    <p className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-300">
                      Während des gesamten Treffens werden Foto- und Videoaufnahmen
                      gemacht. Ich bin außerdem damit einverstanden, dass Bilder von mir
                      in den Kommunikationsmitteln des Jugendtreffens (v.a. für die
                      Homepage) und in den Kommunikationsmitteln von ausgewählten
                      Kooperationspartnern im Zusammenhang mit dem Jugendtreffen und nach
                      Rücksprache mit dem Jugendtreffen verwendet werden dürfen
                    </p>
                  </div>
                </div></>
            )}
          </Step>
        </MultiStepForm>
  )
}

export default RegistrationForm

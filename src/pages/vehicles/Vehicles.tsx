import { useContext, useEffect, useMemo, useState } from 'react';
import { IconCopy, IconPlus, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { BreadcrumbLayout, Centered } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { useMe } from '../../hooks/query/useMe'
import { Notification } from '../../components/Notification/Notification';
import { AuthContext } from '../../context/UserContext';
import { useCreateVehiclePermission, useRevokeVehiclePermission, useVehicles } from '../../hooks/query/useVehicles';

const ALLOWED_DEPARTMENTS = ['AO', 'TA', 'WD', 'HQ'] as const;
const HOLD_DURATION = 1200;

/* ---------- utils ---------- */

function canUseVehiclesAdmin(me: any): boolean {
  if (!me?.staffPositions) return false

  const departments = me.staffPositions.map(
    (sp: any) => sp.staffDepartment?.id
  )

  return departments.some((dep: string) =>
    ALLOWED_DEPARTMENTS.includes(dep as any)
  )
}

const formatDate = (value: Date | string | null | undefined) => {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

const validateVid = (value: string): string | null => {
  if (!value) return 'VID обязателен';
  if (!/^\d+$/.test(value)) return 'VID должен содержать только цифры';
  if (value.length < 6 || value.length > 7) return 'Неправильный формат VID';
  return null;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* noop */
  }
};

/* ---------- component ---------- */

export function VehiclesPage() {
  const { t } = useTranslation();
  const { signed } = useContext(AuthContext);
  const { data: me, isLoading: isLoadingMe } = useMe()

  const canAdmin = signed && !!me && canUseVehiclesAdmin(me)
  const [adminMode, setAdminMode] = useState(false);
  const effectiveAdminMode = canAdmin && adminMode;

  /* ---------- create ---------- */
  const [createOpen, setCreateOpen] = useState(false);
  const [newVid, setNewVid] = useState('');
  const [newValidFrom, setNewValidFrom] = useState('');
  const [newValidUntil, setNewValidUntil] = useState('');
  const [newReason, setNewReason] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [vidError, setVidError] = useState<string | null>(null);

  /* ---------- revoke ---------- */
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdHint, setHoldHint] = useState(false);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  /* ---------- data ---------- */
  const { data: vehicles, isLoading, isError, error } =
    useVehicles(effectiveAdminMode);

  const createMutation = useCreateVehiclePermission();
  const revokeMutation = useRevokeVehiclePermission();

  /* ---------- computed ---------- */

  const canSubmitCreate = useMemo(() => {
    const vErr = validateVid(newVid);
    const hasFrom = !!newValidFrom;
    const untilOk = isUnlimited ? true : true; // validUntil optional anyway
    return !vErr && hasFrom && untilOk && !createMutation.isPending;
  }, [newVid, newValidFrom, isUnlimited, createMutation.isPending]);

  /* ---------- helpers ---------- */

  const resetCreateForm = () => {
    setNewVid('');
    setNewValidFrom('');
    setNewValidUntil('');
    setNewReason('');
    setIsUnlimited(false);
    setVidError(null);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    resetCreateForm();
  };

  const closeRevoke = () => {
    setRevokeTargetId(null);
    setHoldProgress(0);
    setHoldHint(false);
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
  };

  /* ---------- ESC ---------- */
  useEffect(() => {
    if (!createOpen && !revokeTargetId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (createOpen) closeCreate();
        if (revokeTargetId) closeRevoke();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [createOpen, revokeTargetId, holdTimer]);

  /* ---------- revoke hold ---------- */

  const startHold = () => {
    if (!revokeTargetId || revokeMutation.isPending) return;

    setHoldHint(false);
    const start = Date.now();

    const timer = window.setInterval(() => {
      const progress = Math.min((Date.now() - start) / HOLD_DURATION, 1);
      setHoldProgress(progress);

      if (progress >= 1 && revokeTargetId) {
        clearInterval(timer);
        setHoldTimer(null);

        revokeMutation.mutate(revokeTargetId, {
          onSuccess: () => {
            closeRevoke();
          },
          onError: () => {
            // оставляем окно открытым и показываем подсказку
            setHoldHint(true);
            setHoldProgress(0);
          },
        });
      }
    }, 16);

    setHoldTimer(timer);
  };

  const stopHold = () => {
    if (holdTimer) clearInterval(holdTimer);
    if (holdProgress < 0.3) setHoldHint(true);
    setHoldProgress(0);
    setHoldTimer(null);
  };

  /* ---------- create submit ---------- */

  const submitCreate = () => {
    const err = validateVid(newVid);
    setVidError(err);
    if (err) return;
    if (!newValidFrom) return;

    createMutation.mutate(
      {
        vid: Number(newVid),
        validFrom: newValidFrom,
        validUntil: isUnlimited ? null : newValidUntil || null,
        issueReason: newReason || null,
      },
      {
        onSuccess: () => {
          closeCreate();
        },
        onError: () => {
        },
      },
    );
  };

  /* ---------- loading / error ---------- */
  if (isLoading || isLoadingMe) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

  if (isError) {
    return (
      <Notification
        type="error"
        message={error?.message ?? t('notif.server.descritpion')}
        notificationId="vehicles-error"
      />
    );
  }

  return (
    <BreadcrumbLayout>
      {/* HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-3xl font-bold text-black md:text-5xl">
          {t('vehicles.title')}
        </div>

        {canAdmin && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={adminMode}
                onChange={(e) => setAdminMode(e.target.checked)}
                className="accent-blue-600"
              />
              {t('vehicles.adminMode')}
            </label>

            {adminMode && (
              <button
                className="flex items-center gap-2 rounded-xl bg-atmos-700 px-4 py-2 text-sm font-semibold text-white hover:bg-atmos-600"
                onClick={() => setCreateOpen(true)}
              >
                <IconPlus size={16} />
                {t('vehicles.create')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="mt-4 text-neutral-700">{t('vehicles.description')}</div>

      {/* TABLE */}
      {!vehicles || vehicles.length === 0 ? (
        <div className="mt-6 text-neutral-500">{t('vehicles.empty')}</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow text-neutral-900">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-neutral-800">
            <tr>
              <th className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                ID
              </th>
              <th className="px-4 py-3">VID</th>
              <th className="px-4 py-3">{t('vehicles.validFrom')}</th>
              <th className="px-4 py-3">{t('vehicles.validUntil')}</th>
              <th className="px-4 py-3">{t('vehicles.status')}</th>
              <th className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                {t('vehicles.issuedBy')}
              </th>
              <th className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                {t('vehicles.issueReason')}
              </th>
              <th className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                {t('vehicles.revokedAt')}
              </th>
              <th className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                {t('vehicles.revokedBy')}
              </th>
              <th className={`px-4 py-3 text-right ${!effectiveAdminMode && 'hidden'}`}>
                {t('vehicles.actions')}
              </th>
            </tr>
            </thead>

            <tbody>
            {vehicles.map((p) => (
              <tr
                key={p.id}
                className={`border-t ${
                  p.status === 'inactive'
                    ? 'bg-gray-100'
                    : p.status === 'revoked'
                      ? 'bg-red-50'
                      : ''
                }`}
              >
                <td className={`px-4 py-3 text-center ${!effectiveAdminMode && 'hidden'}`}>
                  <button
                    onClick={() => copyToClipboard(p.id)}
                    className="rounded p-1 text-neutral-600 hover:bg-gray-200"
                    title={t('common.copy')}
                  >
                    <IconCopy size={14} />
                  </button>
                </td>

                <td className="px-4 py-3">
                    <a
                      href={`https://ivao.aero/Member.aspx?Id=${p.vid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {p.vid}
                    </a>
                </td>

                <td className="px-4 py-3">{formatDate(p.validFrom)}</td>

                <td className="px-4 py-3">
                  {p.validUntil ? formatDate(p.validUntil) : t('vehicles.unlimited')}
                </td>

                <td className="px-4 py-3">
                  {p.status === 'active' && (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        {t('vehicles.active')}
                      </span>
                  )}
                  {p.status === 'inactive' && (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                        {t('vehicles.inactive')}
                      </span>
                  )}
                  {p.status === 'revoked' && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        {t('vehicles.revoked')}
                      </span>
                  )}
                </td>


                <td className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                  <a
                    href={`https://ivao.aero/Member.aspx?Id=${p.issuedByVid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {p.issuedByVid}
                  </a>
                </td>

                <td className={`px-4 py-3 max-w-xs truncate ${!effectiveAdminMode && 'hidden'}`}>
                  {p.issueReason ?? '—'}
                </td>

                <td className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                  {formatDate(p.revokedAt)}
                </td>

                <td className={`px-4 py-3 ${!effectiveAdminMode && 'hidden'}`}>
                  {p.revokedByVid ? (
                    <a
                      href={`https://ivao.aero/Member.aspx?Id=${p.revokedByVid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {p.revokedByVid}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>

                <td className={`px-4 py-3 text-right ${!effectiveAdminMode && 'hidden'}`}>
                  {p.status === 'active' && (
                    <button
                      className="rounded-lg p-1.5 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      onClick={() => setRevokeTargetId(p.id)}
                      disabled={revokeMutation.isPending}
                      title={t('common.revoke')}
                    >
                      <IconX size={18} />
                    </button>
                  )}
                </td>

              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MODAL */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeCreate}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl text-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-black">
              {t('vehicles.creator.title')}
            </h3>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="VID"
                  value={newVid}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    setNewVid(value);
                    setVidError(validateVid(value));
                  }}
                  className={`w-full rounded-xl border px-3 py-2 ${
                    vidError ? 'border-red-500' : ''
                  }`}
                />
                {vidError && (
                  <div className="mt-1 text-xs text-red-600">{vidError}</div>
                )}
              </div>

              <input
                type="date"
                value={newValidFrom}
                onChange={(e) => setNewValidFrom(e.target.value)}
                className="rounded-xl border px-3 py-2"
              />

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={isUnlimited}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsUnlimited(checked);
                      if (checked) setNewValidUntil('');
                    }}
                    className="accent-blue-600"
                  />
                  {t('vehicles.creator.unlimited')}
                </label>

                {!isUnlimited && (
                  <input
                    type="date"
                    value={newValidUntil}
                    onChange={(e) => setNewValidUntil(e.target.value)}
                    className="rounded-xl border px-3 py-2"
                  />
                )}
              </div>

              <textarea
                placeholder={t('vehicles.issueReason')}
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                rows={3}
                className="rounded-xl border px-3 py-2"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-xl px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-gray-100"
                onClick={closeCreate}
              >
                {t('vehicles.revoker.cancelButton')}
              </button>

              <button
                className="rounded-xl bg-atmos-700 px-4 py-2 text-sm font-semibold text-white hover:bg-atmos-600 disabled:opacity-50"
                disabled={!canSubmitCreate}
                onClick={submitCreate}
              >
                {createMutation.isPending
                  ? t('notif.loading.name')
                  : t('vehicles.creator.submitButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVOKE MODAL */}
      {revokeTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeRevoke}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-black">
              {t('vehicles.revoker.title')}
            </h3>

            <p className="mt-3 text-sm text-neutral-700">
              {t('vehicles.revoker.description')}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-xl px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-gray-100"
                onClick={closeRevoke}
                disabled={revokeMutation.isPending}
              >
                {t('vehicles.revoker.cancelButton')}
              </button>

              <div className="relative w-[220px] overflow-hidden rounded-xl bg-red-600">
                <div
                  className="absolute inset-y-0 left-0 bg-red-800"
                  style={{ width: `${holdProgress * 100}%` }}
                />
                <button
                  className="relative z-10 w-full px-4 py-2 text-sm font-semibold text-white select-none disabled:opacity-60"
                  disabled={revokeMutation.isPending}
                  onMouseDown={startHold}
                  onMouseUp={stopHold}
                  onMouseLeave={stopHold}
                  onTouchStart={startHold}
                  onTouchEnd={stopHold}
                >
                  {revokeMutation.isPending
                    ? t('notif.loading.name')
                    : t('vehicles.revoker.revokeButton')}
                </button>
              </div>
            </div>

            {holdHint && (
              <div className="mt-2 text-center text-xs text-neutral-600">
                {t('vehicles.revoker.holdHint')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GLOBAL MUTATION ERROR */}
      {(createMutation.isError || revokeMutation.isError) && (
        <div className="mt-4">
          <Notification
            type="error"
            message={t('notif.server.descritpion')}
            notificationId="vehicles-mutation-error"
          />
        </div>
      )}
    </BreadcrumbLayout>
  );
}
